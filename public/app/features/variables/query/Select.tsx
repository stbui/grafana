import React, { FC } from 'react';
// @ts-ignore
import { default as ReactSelect } from '@torkelo/react-select';
// @ts-ignore
import { css, cx } from 'emotion';
import { Select as GrafanaSelect } from '@grafana/ui';

export const Select: FC<any> = ({ defaultValue, value, options, onChange, ...reset }) => {
  const optionValue = options.find((option: any) => option.value === value);

  return <GrafanaSelect placeholder="请选择" value={optionValue} options={options} onChange={onChange} {...reset} />;
};

export default Select;
