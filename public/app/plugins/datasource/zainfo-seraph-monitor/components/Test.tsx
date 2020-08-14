import React from 'react';
import coreModule from 'app/core/core_module';

const Editor = () => <div>kustoEditor</div>;

coreModule.directive('kustoEditor', [
  'reactDirective',
  reactDirective => {
    return reactDirective(Editor, [
      'change',
      'database',
      'execute',
      'query',
      'variables',
      'placeholder',
      ['getSchema', { watchDepth: 'reference' }],
    ]);
  },
]);
