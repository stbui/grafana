import _ from 'lodash';
import { dateMath } from '@grafana/data';
import { DataSourceWithBackend, getTemplateSrv } from '@grafana/runtime';
import { Observable, from } from 'rxjs';
import InfluxSeries from './influx_series';

export class DataSource extends DataSourceWithBackend {
  instanceSettings: any;
  backendSrv: any;
  urls: string[];
  username: string;
  password: string;
  name: string;
  database: any;
  seraphApi: any;

  constructor(instanceSettings: any, $q: any, backendSrv: any, templateSrv: any) {
    super(instanceSettings);
    this.instanceSettings = instanceSettings;
    this.backendSrv = backendSrv;
    this.urls = (instanceSettings.url ?? '').split(',').map((url: any) => {
      return url.trim();
    });

    this.username = instanceSettings.username ?? '';
    this.password = instanceSettings.password ?? '';
    // this.database = instanceSettings.database;
    this.database = 'k8s_metric';

    this.seraphApi = instanceSettings.jsonData.seraphApi;
  }

  query(request: any): Observable<any> {
    return from(this.classicQuery(request));
  }

  getInfluxTime(date: any, roundUp: any, timezone: any) {
    if (_.isString(date)) {
      if (date === 'now') {
        return 'now()';
      }

      const parts = /^now-(\d+)([dhms])$/.exec(date);
      if (parts) {
        const amount = parseInt(parts[1], 10);
        const unit = parts[2];
        return 'now() - ' + amount + unit;
      }
      date = dateMath.parse(date, roundUp, timezone);
    }

    return date.valueOf() + 'ms';
  }

  getTimeFilter(options: any) {
    const from = this.getInfluxTime(options.rangeRaw.from, false, options.timezone);
    const until = this.getInfluxTime(options.rangeRaw.to, true, options.timezone);
    const fromIsAbsolute = from[from.length - 1] === 'ms';

    if (until === 'now()' && !fromIsAbsolute) {
      return 'time >= ' + from;
    }

    return 'time >= ' + from + ' and time <= ' + until;
  }

  async classicQuery(options: any): Promise<any> {
    let timeFilter = this.getTimeFilter(options);
    const scopedVars = options.scopedVars;
    const targets = _.cloneDeep(options.targets);
    const queryTargets: any[] = [];

    let i, y;
    const templateSrv = getTemplateSrv();

    let allQueries = _.map(targets, target => {
      if (target.hide) {
        return '';
      }

      queryTargets.push(target);

      // backward compatibility
      scopedVars.interval = scopedVars.__interval;

      // return 'select * from ecs_node_memory_usage_rate where time >now()-70d order by time desc limit 20';
      return target.query;
    }).reduce((acc, current) => {
      if (current !== '') {
        acc += ';' + current;
      }
      return acc;
    });

    if (allQueries === '') {
      return Promise.resolve({ data: [] });
    }

    // const adhocFilters = (templateSrv as any).getAdhocFilters(this.name);
    allQueries = templateSrv.replace(allQueries, scopedVars);
    // const a = templateSrv.replace('A/^$groupby$/B', { text: '2', value: '1' }, 'regex');
    console.log(scopedVars);

    scopedVars.timeFilter = { value: timeFilter };

    return this._seriesQuery(allQueries, options).then((data: any): any => {
      if (!data || !data.results) {
        return [];
      }

      const seriesList: any = [];
      for (i = 0; i < data.results.length; i++) {
        const result = data.results[i];
        if (!result || !result.series) {
          continue;
        }

        const target = queryTargets[i];
        let alias = target.alias;
        if (alias) {
          alias = templateSrv.replace(target.alias, options.scopedVars);
        }

        const meta: any = {
          executedQueryString: data.executedQueryString,
        };

        const influxSeries = new InfluxSeries({
          refId: target.refId,
          series: data.results[i].series,
          alias: alias,
          meta,
        });

        switch (target.resultFormat) {
          case 'logs':
            meta.preferredVisualisationType = 'logs';
          case 'table': {
            seriesList.push(influxSeries.getTable());
            break;
          }
          default: {
            const timeSeries = influxSeries.getTimeSeries();
            for (y = 0; y < timeSeries.length; y++) {
              seriesList.push(timeSeries[y]);
            }
            break;
          }
        }
      }

      return { data: seriesList };
    });
  }

  _seriesQuery(query: string, options?: any) {
    if (!query) {
      return Promise.resolve({ results: [] });
    }

    if (options && options.range) {
      const timeFilter = this.getTimeFilter({ rangeRaw: options.range, timezone: options.timezone });
      query = query.replace('$timeFilter', timeFilter);
    }

    return this._influxRequest('GET', '/query', { q: query, epoch: 'ms' }, options);
  }

  _influxRequest(method: string, url: string, data: any, options?: any) {
    const currentUrl = this.urls.shift()!;
    this.urls.push(currentUrl);

    const params: any = {};

    if (this.username) {
      params.u = this.username;
      params.p = this.password;
    }

    if (options && options.database) {
      params.db = options.database;
    } else if (this.database) {
      params.db = this.database;
    }

    const { q } = data;

    if (method === 'POST' && _.has(data, 'q')) {
      // verb is POST and 'q' param is defined
      _.extend(params, _.omit(data, ['q']));
      data = this.serializeParams(_.pick(data, ['q']));
    } else if (method === 'GET' || method === 'POST') {
      // verb is GET, or POST without 'q' param
      _.extend(params, data);
      data = null;
    }

    const req: any = {
      method: method,
      url: currentUrl + url,
      params: params,
      data: data,
      precision: 'ms',
      inspect: { type: 'influxdb' },
      paramSerializer: this.serializeParams,
    };

    req.headers = req.headers || {};

    if (method === 'POST') {
      req.headers['Content-type'] = 'application/x-www-form-urlencoded';
    }
    console.log(req);
    return this.backendSrv.datasourceRequest(req).then(
      (result: any) => {
        const { data } = result;
        if (data) {
          data.executedQueryString = q;
          if (data.results) {
            const errors = result.data.results.filter((elem: any) => elem.error);
            if (errors.length > 0) {
              throw {
                message: 'InfluxDB Error: ' + errors[0].error,
                data,
              };
            }
          }
        }
        return data;
      },
      (err: any) => {
        if ((Number.isInteger(err.status) && err.status !== 0) || err.status >= 300) {
          if (err.data && err.data.error) {
            throw {
              message: 'InfluxDB Error: ' + err.data.error,
              data: err.data,
              config: err.config,
            };
          } else {
            throw {
              message: 'Network Error: ' + err.statusText + '(' + err.status + ')',
              data: err.data,
              config: err.config,
            };
          }
        } else {
          throw err;
        }
      }
    );
  }

  serializeParams(params: any) {
    if (!params) {
      return '';
    }

    return _.reduce(
      params,
      (memo, value, key) => {
        if (value === null || value === undefined) {
          return memo;
        }
        memo.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
        return memo;
      },
      [] as string[]
    ).join('&');
  }

  getSeraphMonitor() {
    const req = {
      url: '',
    };
    return this.backendSrv.datasourceRequest(req).then(() => {
      const test = {
        k8sMetric: {
          jvm监控: {
            jvm: {
              jvm_memery_usage: {
                filed: ['filed1', 'filed2'],
                tag: ['usage_app', 'usage_host', 'podName'],
              },
              jvm_gc_pause_seconds_count: {
                filed: ['value', 'count'],
                tag: ['count_app', 'host', 'podName'],
              },
            },
          },
          容器监控: {
            k8s: {
              k8s_node_avaliable: {
                filed: ['value'],
                tag: ['app', 'host', 'podName'],
              },
            },
          },
        },
        metric_agg: {
          日志监控: {
            xxx: {
              xxxyyy: {
                filed: ['value'],
                tag: ['app', 'host', 'podName'],
              },
            },
          },
        },
      };

      return test.k8sMetric;
    });
  }
}
