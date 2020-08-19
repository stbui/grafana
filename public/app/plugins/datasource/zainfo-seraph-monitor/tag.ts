import _ from 'lodash';
import coreModule from 'app/core/core_module';
import { GrafanaRootScope } from 'app/routes/GrafanaCtrl';
import { seraphSelectUpdated } from './event';

export class TagCtrl {
  /** @ngInject */
  constructor($scope: any, uiSegmentSrv: any, $rootScope: GrafanaRootScope) {
    const segment = $scope.segment;
    const tags = $scope.target.tags;

    $rootScope.onAppEvent(
      seraphSelectUpdated,
      () => {
        $scope.validateModel();
      },
      $scope
    );

    $scope.init = () => {
      $scope.operators = [
        { text: '=', value: '=' },
        { text: '!=', value: '!=' },
        { text: '>', value: '>' },
        { text: '<', value: '<' },
        { text: '<>', value: '<>' },
      ];

      $scope.conditions = [
        { text: 'AND', value: 'AND' },
        { text: 'OR', value: 'OR' },
      ];

      // 初始化
      $scope.filterKey = segment.key;
      $scope.operator = segment.operator;
      $scope.value = segment.value;
      $scope.condition = segment.condition;

      $scope.agg = tags[$scope.index];
      $scope.validateModel();
    };

    $scope.validateModel = () => {
      $scope.index = _.indexOf(tags, $scope.agg);
      $scope.isFirst = $scope.index === 0;
      $scope.count = tags.length;

      $scope.fields = $scope.getFields();
    };

    $scope.addFilterAgg = () => {
      tags.push({ condition: 'AND' });
      $scope.onChange();
    };

    $scope.removeFilterAgg = () => {
      tags.splice($scope.index, 1);
      $scope.onChange();
    };

    $scope.fieldsChanged = () => {
      segment.key = $scope.filterKey;
      $scope.onChange();
    };
    $scope.operatorsChanged = () => {
      segment.operator = $scope.operator;
      $scope.onChange();
    };
    $scope.valueChanged = () => {
      segment.value = $scope.value;
      $scope.onChange();
    };

    $scope.init();
  }
}

export function seraphTag() {
  return {
    templateUrl: 'public/app/plugins/datasource/zainfo-seraph-monitor/partials/tag.html',
    controller: TagCtrl,
    restrict: 'E',
    scope: {
      target: '=',
      index: '=',
      getFields: '&',

      segment: '=',
      getOptions: '&',
      onChange: '&',
    },
  };
}

coreModule.directive('seraphTag', seraphTag);
