import coreModule from 'app/core/core_module';
import Tag from './Tag';

coreModule.directive('seraphTag', [
  'reactDirective',
  reactDirective => {
    return reactDirective(Tag, [
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
