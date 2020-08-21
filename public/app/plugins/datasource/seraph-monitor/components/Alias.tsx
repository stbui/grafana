import React from 'react';

export default ({ defaultValue, value, onChange }: any) => {
  return (
    <div className="gf-form-inline">
      <div className="gf-form">
        <label className="gf-form-label query-keyword width-7">别名</label>
      </div>
      <div className="gf-form">
        <input defaultValue={defaultValue} type="text" className="gf-form-input width-10" placeholder="请输入" />
      </div>
    </div>
  );
};
