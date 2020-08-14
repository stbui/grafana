import React from 'react';
import { Select } from '@grafana/ui';

const Tag = () => {
  return (
    <div>
      Tag
      <Select options={[{ text: 1, value: 2 }]} onChange={() => {}} />
    </div>
  );
};

export default Tag;
