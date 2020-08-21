import { getTemplateSrv } from '@grafana/runtime';

export const getVariables = () => {
  const templateSrv = getTemplateSrv();
  const variables = templateSrv.getVariables();
  const segments = [];
  console.log(variables);
  for (const variable of variables) {
    segments.unshift('/^$' + variable.name + '$/');
  }

  return segments;
};

export function getMeasurementAndPolicy(mean: any, interpolate?: any) {
  let measurement = mean || 'measurement';
  // const getTemplate = getTemplateSrv();

  if (!measurement.match('^/.*/$')) {
    measurement = '"' + measurement + '"';
  } else if (interpolate) {
    // measurement = getTemplate.replace(measurement, this.scopedVars, 'regex');
  }

  return measurement;
}

export const sqlBuilder = (o: any) => {
  const source = o;
  let sql = 'SELECT ';

  if (source.select) {
    let selectField = source.select.map((field: any) => {
      return `"${field.value}"`;
    });
    sql += selectField.join(',');
  }

  sql += ` FROM ${source.measurement} WHERE `;

  //
  if (source.tags) {
    const tags = source.tags.map((tag: any, index: any) => {
      let str = '';
      let operator = tag.operator;
      let value = tag.value;
      if (index > 0) {
        str = (tag.condition || 'AND') + ' ';
      }

      if (!operator) {
        if (/^\/.*\/$/.test(value)) {
          operator = '=~';
        } else {
          operator = '=';
        }
      }

      return str + '"' + tag.key + '" ' + operator + ' ' + value;
    });

    if (tags.length > 0) {
      sql += '(' + tags.join(' ') + ') AND ';
    }
  }

  sql += '$timeFilter';

  //
  if (source.groupBy) {
    let groupby = source.groupBy.map((d: any) => {
      if (d.type === 'tag') {
        return `"${d.value}"`;
      }
      return `${d.type}(${d.value})`;
    });

    if (groupby.length > 0) {
      sql += ' GROUP BY ';
      sql += groupby.join();
    }

    if (source.orderByTime === 'DESC') {
      sql += ' ORDER BY time DESC';
    }
  }

  return sql;
};
