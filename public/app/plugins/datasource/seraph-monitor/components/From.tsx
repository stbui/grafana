import React, { useState, useEffect } from 'react';
import { Select } from '@grafana/ui';
import { getVariables } from './util';

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

export default ({ defaultValue, data, onChange }: any) => {
  const typeOptions = getSerapMonitorType(data);

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

  const onMetricChange = ({ label, value }: any, isInit?: any) => {
    const metricField = data[typeCache][groupCache][value];
    if (metricField.filed) {
      metricField.filed = [...getVariables(), ...metricField.filed];
    } else {
      metricField.filed = getVariables();
    }

    if (metricField.tag) {
      metricField.tag = [...getVariables(), ...metricField.tag];
    } else {
      metricField.tag = getVariables();
    }

    onChange && onChange({ monitorType: typeCache, monitorGroup: groupCache, measurement: value }, metricField, isInit);
  };

  useEffect(() => {
    if (defaultValue.monitorType && defaultValue.monitorType) {
      onTypeChange({ label: defaultValue.monitorType, value: defaultValue.monitorType });
      onGroupChange({ label: defaultValue.monitorGroup, value: defaultValue.monitorGroup });
      onMetricChange({ label: defaultValue.measurement, value: defaultValue.measurement }, true);
    }
  }, []);

  return (
    <div className="gf-form-inline">
      <div className="gf-form">
        <label className="gf-form-label query-keyword width-7">数据源</label>
      </div>
      <div className="gf-form" style={{ marginRight: 4 }}>
        <Select
          defaultValue={{ label: defaultValue.monitorType, value: defaultValue.monitorType }}
          width={20}
          options={typeOptions}
          placeholder="请选择"
          onChange={onTypeChange}
        />
      </div>
      <div className="gf-form" style={{ marginRight: 4 }}>
        <Select
          defaultValue={{ label: defaultValue.monitorGroup, value: defaultValue.monitorGroup }}
          width={20}
          options={group}
          placeholder="请选择"
          onChange={onGroupChange}
        />
      </div>
      <div className="gf-form" style={{ marginRight: 4 }}>
        <Select
          defaultValue={{ label: defaultValue.measurement, value: defaultValue.measurement }}
          width={30}
          options={metric}
          placeholder="请选择"
          onChange={onMetricChange}
        />
      </div>
    </div>
  );
};
