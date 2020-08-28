import React, { FC } from 'react';
// @ts-ignore
import { default as ReactSelect } from '@torkelo/react-select';
// @ts-ignore
import { css, cx } from 'emotion';

// interface SelectProps {
//   options: any[];
//   placeholder: string;
// }

const customStyles = {
  indicatorsContainer: () => {
    return null;
  },
  // valueContainer: (provided: any) => {
  //   return { ...provided, fontSize: 14 };
  // },
};

export const Select: FC<any> = ({ defaultValue, value, options, onChange, ...reset }) => {
  const optionValue = options.find((option: any) => option.value === value);

  return (
    <ReactSelect
      placeholder="请选择"
      styles={customStyles}
      value={optionValue}
      options={options}
      onChange={onChange}
      {...reset}
    />
  );
};

export default Select;
