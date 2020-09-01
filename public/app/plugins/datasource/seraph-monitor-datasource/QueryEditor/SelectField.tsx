// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Select, Cascader } from '@grafana/ui';
import Plus from './Plus';
import Minus from './Minus';

const optionsa = [
  {
    label: 'Aggregations',
    value: 'Aggregations',
    items: [
      {
        label: 'count',
        value: 'count',
      },
      {
        label: 'distinct',
        value: 'distinct',
      },
      {
        label: 'integral',
        value: 'integral',
      },
      {
        label: 'mean',
        value: 'mean',
      },
      {
        label: 'median',
        value: 'median',
      },
      {
        label: 'mode',
        value: 'mode',
      },
      {
        label: 'sum',
        value: 'sum',
      },
    ],
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

  const onSelectChange = ({ label, value }: any, key: any) => {
    const newData = [...state];
    newData[key].value = value;
    newData[key].label = label;

    onChange && onChange(newData);
  };

  const onCascaderSelect = (value, key: any) => {
    if (value !== 'Aggregations') {
      const newData = [...state];
      newData[key].fun = value;

      onChange && onChange(newData);
    }
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
            <label className="gf-form-label query-keyword width-7">值</label>
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
        <div className="gf-form-inline" key={s.index}>
          <div className="gf-form" style={{ visibility: key === 0 ? 'visible' : 'hidden' }}>
            <label className="gf-form-label query-keyword width-7">值</label>
          </div>
          <div className="gf-form" style={{ marginRight: 4 }}>
            <Select
              width={20}
              placeholder="请选择"
              options={options}
              defaultValue={{ label: s.label, value: s.value }}
              onChange={value => onSelectChange(value, key)}
            />
          </div>
          <div className="gf-form" style={{ marginRight: 4 }}>
            <Cascader
              width={20}
              initialValue={s.fun}
              options={optionsa}
              onSelect={value => onCascaderSelect(value, key)}
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
