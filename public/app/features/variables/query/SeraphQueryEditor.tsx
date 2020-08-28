import React, { useState, useEffect } from 'react';
import Select from './Select';
import { getDatasourceSrv } from '../../plugins/datasource_srv';

export const useQuery = () => {
  const [state, setState] = useState({
    data: [],
    loading: true,
  });

  const getDatasource = async () => {
    const dataSource: any = await getDatasourceSrv().get('seraph-monitor-datasource');

    if (!dataSource.getSeraphMonitor) {
      return setState({ data: [], loading: false });
    }

    return dataSource.getSeraphMonitor().then((data: any) => {
      setState({ data: data, loading: false });
    });
  };

  useEffect(() => {
    getDatasource();
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

  return fields.map(f => ({ label: value[f].metric_comment, value: f }));
};

export const SeraphQueryEditor = (props: any) => {
  const { data, loading } = useQuery();

  // @ts-ignore
  const [monitorType, setMonitorType] = useState(() => {
    return props.query.split(',')[0];
  });
  const [monitorGroup, setMonitorGroup] = useState(() => {
    return props.query.split(',')[1];
  });
  const [monitorMetric, setMonitorMetric] = useState(() => {
    return props.query.split(',')[2];
  });

  const types = getSerapMonitorType(data);
  const [group, setGroup] = useState([]);
  const [metric, setMetric] = useState([]);

  const onTypeChange = ({ label, value }: any) => {
    typeCache = value;
    const g = getSerapMonitorGroup(data, value);
    setGroup(g);
    setMonitorType(value);
  };

  const onGroupChange = ({ label, value }: any) => {
    groupCache = value;
    const g = getSerapMonitorMetric(data, typeCache, value);
    setMetric(g);
    setMonitorGroup(value);
  };

  const onMetricChange = ({ label, value }: any) => {
    props.onChange(`${typeCache},${groupCache},${value}`);
    setMonitorMetric(value);
  };

  useEffect(() => {
    if (props.query && !loading) {
      const [monitorType, monitorGroup, measurement] = props.query.split(',');
      console.log(12345, monitorType, monitorGroup, measurement);
      onTypeChange({ label: monitorType, value: monitorType });
      onGroupChange({ label: monitorGroup, value: monitorGroup });
      onMetricChange({ label: measurement, value: measurement });
    }
  }, [loading]);

  return (
    <div className="gf-form">
      <div className="gf-form-inline">
        <div className="gf-form" style={{ marginRight: 8 }}>
          <span className="gf-form-label width-6">数据源</span>

          <div className="width-12">
            <Select value={monitorType} options={types} onChange={onTypeChange} />
          </div>
        </div>

        <div className="gf-form" style={{ marginRight: 8 }}>
          <div className="width-12">
            <Select value={monitorGroup} options={group} onChange={onGroupChange} />
          </div>
        </div>

        <div className="gf-form">
          <div className="width-12">
            <Select value={monitorMetric} options={metric} onChange={onMetricChange} />
          </div>
        </div>
      </div>
    </div>
  );
};
