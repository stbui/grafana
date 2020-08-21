import React, { useState, useEffect } from 'react';
import { Select } from '@grafana/ui';
import Plus from './Plus';
import Minus from './Minus';

export const operator = [
  {
    label: '=',
    value: '=',
  },
  {
    label: '!=',
    value: '!=',
  },
  {
    label: '=~',
    value: '=~',
  },
  {
    label: '>',
    value: '>',
  },
  {
    label: '<',
    value: '<',
  },
];

export const condition = [
  {
    label: 'AND',
    value: 'AND',
  },
  {
    label: 'OR',
    value: 'OR',
  },
];

export default ({ defaultValue, filed, onChange }: any) => {
  const options = filed.map((f: any) => ({ label: f, value: f }));

  const [state, setState] = useState(defaultValue || []);

  const onAdd = () => {
    const newData = [...state, { index: Math.random() }];
    setState(newData);
  };

  const onRemove = (index: any) => {
    const newData = [...state];
    newData.splice(index, 1);

    setState(newData);

    onChange && onChange(newData);
  };

  const onSelectConditionChange = ({ label, value }: any, key: any) => {
    const newData = [...state];
    newData[key].condition = value;
    newData[key].condition_label = label;

    onChange && onChange(newData);
  };
  const onSelectKeyChange = ({ label, value }: any, key: any) => {
    const newData = [...state];
    newData[key].key = value;
    newData[key].key_label = label;

    onChange && onChange(newData);
  };
  const onSelectOperatorChange = ({ label, value }: any, key: any) => {
    const newData = [...state];
    newData[key].operator = value;
    newData[key].operator_label = label;

    onChange && onChange(newData);
  };
  const onSelectValueChange = ({ target: { value } }: any, key: any) => {
    const newData = [...state];
    newData[key].value = value;

    onChange && onChange(newData);
  };

  useEffect(() => {
    if (defaultValue) {
      setState(defaultValue);
    }
  }, []);

  return (
    <div className="">
      {state.length === 0 ? (
        <div className="gf-form-inline">
          <div className="gf-form">
            <label className="gf-form-label query-keyword width-7">过滤规则</label>
          </div>
          <div className="gf-form">
            <label className="gf-form-label">
              <a className="pointer" onClick={onAdd}>
                <Plus />
              </a>
            </label>
          </div>
        </div>
      ) : null}
      {state.map((s: any, key: any) => (
        <React.Fragment key={s.index}>
          <div className="gf-form-inline" style={{ display: key === 0 ? 'none' : 'flex' }}>
            <div className="gf-form" style={{ visibility: 'hidden' }}>
              <label className="gf-form-label query-keyword width-7">过滤规则</label>
            </div>
            <div className="gf-form">
              <Select
                width={20}
                options={condition}
                placeholder="请选择"
                defaultValue={{ label: s.condition_label, value: s.condition }}
                onChange={value => onSelectConditionChange(value, key)}
              />
            </div>
          </div>
          <div className="gf-form-inline">
            <div className="gf-form" style={{ visibility: key === 0 ? 'visible' : 'hidden' }}>
              <label className="gf-form-label query-keyword width-7">过滤规则</label>
            </div>
            <div className="gf-form" style={{ marginRight: 4 }}>
              <Select
                width={20}
                options={options}
                placeholder="请选择"
                defaultValue={{ label: s.key_label, value: s.key }}
                onChange={value => onSelectKeyChange(value, key)}
              />
            </div>
            <div className="gf-form" style={{ marginRight: 4 }}>
              <Select
                width={20}
                options={operator}
                placeholder="请选择"
                defaultValue={{ label: s.operator_label, value: s.operator }}
                onChange={value => onSelectOperatorChange(value, key)}
              />
            </div>
            <div className="gf-form" style={{ marginRight: 4 }}>
              <input
                placeholder="请输入"
                className="gf-form-input width-10"
                defaultValue={s.value}
                onChange={value => onSelectValueChange(value, key)}
              />
            </div>
            <div className="gf-form" style={{ marginRight: 4 }}>
              <label className="gf-form-label">
                <a className=" pointer" onClick={() => onRemove(key)}>
                  <Minus />
                </a>
              </label>
            </div>
          </div>
        </React.Fragment>
      ))}

      {state.length !== 0 ? (
        <div className="gf-form offset-width-7" style={{ paddingLeft: 4 }}>
          <label className="gf-form-label">
            <a className="pointer" onClick={onAdd}>
              <Plus />
            </a>
          </label>
        </div>
      ) : null}
    </div>
  );
};
