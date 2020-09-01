import React, { FC, useState, useEffect } from 'react';
import { Select as GrafanaSelect, MultiSelect } from '@grafana/ui';

export const Select: FC<any> = ({ defaultValue, value, options, onChange, multi, ...reset }) => {
  const optionValue = options.find((option: any) => option.value === defaultValue);
  const [state, setState] = useState(optionValue);

  const onSelectChange = (value: any) => {
    if (!multi) {
      setState({ label: value.label, value: value.value });
      onChange && onChange(value.value);
    } else {
      setState(value);
      const val = value.map((d: any) => d.value);

      onChange && onChange(val);
    }
  };

  useEffect(() => {
    if (options) {
      if (multi) {
        setState(defaultValue || value);
      } else {
        if (defaultValue) {
          const optionValue = options.find((option: any) => option.value === defaultValue);
          setState(optionValue);
          return;
        }

        const optionValue = options.find((option: any) => option.value === value);
        setState(optionValue);
      }
    }
  }, [options]);

  if (multi) {
    return <MultiSelect placeholder="请选择" value={state} options={options} onChange={onSelectChange} {...reset} />;
  }

  return <GrafanaSelect placeholder="请选择" value={state} options={options} onChange={onSelectChange} {...reset} />;
};

export default Select;
