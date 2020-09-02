import React, { useState, useEffect } from 'react';
import Select from './Select';
import Plus from './Plus';
import Minus from './Minus';

const mean = [
  { label: 'count', value: 'count' },
  { label: 'sum', value: 'sum' },
];

const time = [
  { label: '聚合时间(1m)', value: '1m' },
  { label: '聚合时间(5m)', value: '5m' },
  { label: '聚合时间(10m)', value: '10m' },
];

const fill = [
  { label: 'none', value: 'none' },
  { label: 'null', value: 'null' },
];

const initialState = [{ type: 'time', value: '1s', index: Math.random() }];

export default ({ defaultValue, onChange, tag }: any) => {
  const options = tag.map((f: any) => ({ label: f, value: f }));

  const [state, setState] = useState(defaultValue || initialState);

  const onAdd = () => {
    const newData = [...state, { type: 'tag', index: Math.random() }];
    setState(newData);
  };

  const onRemove = (index: any) => {
    const newData = [...state];
    newData.splice(index, 1);

    setState(newData);

    onChange && onChange(newData);
  };

  const onSelectChange = (value: any, key: any) => {
    const newData = [...state];
    newData[key].value = value;

    onChange && onChange(newData);
  };

  const renderSelect = (s: any, key: any) => {
    switch (s.type) {
      case 'fill':
        return (
          <Select
            width={20}
            options={fill}
            defaultValue={s.value}
            onChange={(value: any) => onSelectChange(value, key)}
          />
        );
      case 'time':
        return (
          <Select
            width={20}
            options={time}
            defaultValue={s.value}
            onChange={(value: any) => onSelectChange(value, key)}
          />
        );
      case 'mean':
        return (
          <Select
            width={20}
            options={mean}
            defaultValue={s.value}
            onChange={(value: any) => onSelectChange(value, key)}
          />
        );
      default:
        return (
          <Select
            width={20}
            options={options}
            defaultValue={s.value}
            onChange={(value: any) => onSelectChange(value, key)}
          />
        );
    }
  };

  useEffect(() => {
    if (defaultValue) {
      setState(defaultValue);
    }
  }, []);

  return (
    <div>
      {state.length === 0 ? (
        <div className="gf-form-inline">
          <div className="gf-form">
            <label className="gf-form-label query-keyword width-7">聚合规则</label>
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
            <label className="gf-form-label query-keyword width-7">聚合规则</label>
          </div>
          <div className="gf-form" style={{ marginRight: 4 }}>
            {renderSelect(s, key)}
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
