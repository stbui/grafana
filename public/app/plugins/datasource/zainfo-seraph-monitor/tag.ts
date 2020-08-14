import _ from 'lodash';
import coreModule from 'app/core/core_module';
import { GrafanaRootScope } from 'app/routes/GrafanaCtrl';
import { CoreEvents } from 'app/types';

export class MetricFilterAggCtrl {
  /** @ngInject */
  constructor($scope: any, uiSegmentSrv: any, $rootScope: GrafanaRootScope) {
    const fitlerAggs = $scope.target.tags;

    $rootScope.onAppEvent(
      CoreEvents.elasticQueryUpdated,
      () => {
        $scope.validateModel();
      },
      $scope
    );

    $scope.init = () => {
      $scope.fields = [
        { text: 1, value: 1 },
        { text: 2, value: 2 },
      ];

      $scope.operators = [
        { text: '>', value: '>' },
        { text: '<', value: '<' },
      ];

      $scope.conditions = [
        { text: 'and', value: 'AND' },
        { text: 'or', value: 'OR' },
      ];

      // 初始化
      $scope.condition = 'AND';
      $scope.filterKey = 1;

      $scope.agg = fitlerAggs[$scope.index];
      $scope.validateModel();
    };

    $scope.validateModel = () => {
      $scope.index = _.indexOf(fitlerAggs, $scope.agg);
      $scope.isFirst = $scope.index === 0;
      $scope.fitlerAggCount = fitlerAggs.length;
    };

    $scope.addFilterAgg = () => {
      fitlerAggs.push({ condition: 'AND' });
      $scope.onChange();
    };

    $scope.removeFilterAgg = () => {
      fitlerAggs.splice($scope.index, 1);
      $scope.onChange();
    };

    $scope.fieldsChanged = () => {
      fitlerAggs[$scope.index].key = $scope.filterKey;
      $scope.onChange();
    };
    $scope.operatorsChanged = () => {
      fitlerAggs[$scope.index].operator = $scope.operator;
      $scope.onChange();
    };
    $scope.valueChanged = () => {
      fitlerAggs[$scope.index].value = $scope.value;
      $scope.onChange();
    };

    $scope.init();
  }
}

export function metricFilterAgg() {
  return {
    templateUrl: 'public/app/plugins/datasource/zainfo-seraph-monitor/partials/tag.html',
    controller: MetricFilterAggCtrl,
    restrict: 'E',
    scope: {
      target: '=',
      index: '=',
      onChange: '&',
      getFields: '&',
      esVersion: '=',
    },
  };
}

coreModule.directive('metricTag', metricFilterAgg);
