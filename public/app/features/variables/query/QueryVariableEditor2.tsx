import React, { useState, useEffect } from 'react';
import { Select } from './Select';
import { VariableRefresh } from '../types';

const test: any = {
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
      jvm2: {
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

export const useQuery = () => {
  const [state, setState] = useState({
    data: test.k8sMetric,
    loading: false,
  });

  useEffect(() => {
    fetch('url')
      .then(res => res.json())
      .then(data => {
        setState({
          data: data,
          loading: false,
        });
      });
  }, []);

  return state;
};

let typeCache: any;
let groupCache: any;

export const getSerapMonitorType: any = (data: any) => {
  if (!data) {
    return [];
  }

  const fields = Object.keys(data);
  return fields.map(f => ({ label: f, value: f }));
};

export const getSerapMonitorGroup: any = (data: any, monitorType: any) => {
  if (!data) {
    return [];
  }
  const value = data[monitorType];
  const fields = Object.keys(value);

  return fields.map(f => ({ label: f, value: f }));
};

export const getSerapMonitorMetric: any = (data: any, monitorType: any, monitorGroup: any) => {
  if (!data) {
    return [];
  }
  const value = data[monitorType][monitorGroup];
  const fields = Object.keys(value);

  return fields.map(f => ({ label: f, value: f }));
};

export const QueryVariableEditor = (props: any) => {
  const { data } = useQuery();

  const types = getSerapMonitorType(data);

  const [group, setGroup] = useState([]);
  const [metric, setMetric] = useState([]);

  const onTypeChange = ({ label, value }: any) => {
    typeCache = value;
    const g = getSerapMonitorGroup(data, value);
    setGroup(g);
  };

  const onGroupChange = ({ label, value }: any) => {
    groupCache = value;
    const g = getSerapMonitorMetric(data, typeCache, value);
    setMetric(g);
  };

  const onMetricChange = ({ label, value }: any) => {
    // @ts-ignore
    const metricField = data[typeCache][groupCache][value];

    // @ts-ignore
    const options = [
      { selected: true, text: 'a', value: 'a' },
      { selected: false, text: '2', value: 'a3' },
    ];

    // props.onPropChange({ propName: 'query', propValue: '12,3,45' });
    props.onPropChange({ propName: 'options', propValue: options });
  };

  const onRefreshChange = (event: any) => {
    props.onPropChange({ propName: 'refresh', propValue: parseInt(event.target.value, 10) });
  };

  return (
    <div className="gf-form-group">
      <h5 className="section-heading">查询选选项</h5>
      <div className="gf-form-inline">
        <div className="gf-form">
          <span className="gf-form-label width-6">数据源</span>

          <div className="width-12">
            <Select options={types} onChange={onTypeChange} />
          </div>
        </div>

        <div className="gf-form">
          <div className="width-12">
            <Select options={group} onChange={onGroupChange} />
          </div>
        </div>

        <div className="gf-form">
          <div className="width-12">
            <Select options={metric} onChange={onMetricChange} />
          </div>
        </div>
      </div>

      <div className="gf-form">
        <span className="gf-form-label width-6">刷新频率</span>

        <div className="width-12">
          <Select
            value={props.variable.refresh}
            options={[
              { label: '从不', value: VariableRefresh.never },
              { label: '页面加载', value: VariableRefresh.onDashboardLoad },
              { label: '时间范围切换', value: VariableRefresh.onTimeRangeChanged },
            ]}
            onChange={onRefreshChange}
          />
        </div>
      </div>
    </div>
  );
};
