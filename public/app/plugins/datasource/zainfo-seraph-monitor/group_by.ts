import _ from 'lodash';
import coreModule from 'app/core/core_module';
import { GrafanaRootScope } from 'app/routes/GrafanaCtrl';
import { CoreEvents } from 'app/types';

const template = `
<select class="gf-form-input" ng-model="ctrl.model" ng-options="f.value as f.text for f in ctrl.options"></select>
`;

export class seraphTimeCtrl {
  model: any;
  options: any;

  $onInit() {
    this.options = [
      { value: 1, text: '聚合周期(1m)' },
      { value: 5, text: '聚合周期(5m)' },
      { value: 10, text: '聚合周期(10m)' },
    ];
  }
}

export function seraphTime() {
  return {
    restrict: 'E',
    controller: seraphTimeCtrl,
    bindToController: true,
    controllerAs: 'ctrl',
    template: template,
    scope: {
      model: '=',
    },
  };
}

coreModule.directive('seraphTime', seraphTime);

export class seraphGroupCtrl {
  /** @ngInject */
  constructor($scope: any, uiSegmentSrv: any, $rootScope: GrafanaRootScope) {
    const fitlerAggs = $scope.target.groupBy;
    // const groupBy = $scope.target.groupBy;

    $rootScope.onAppEvent(
      CoreEvents.elasticQueryUpdated,
      () => {
        $scope.validateModel();
      },
      $scope
    );

    $scope.init = () => {
      if ($scope.groupBySegment.type === 'fill') {
        this.getFillSelectOptions($scope);
      } else if ($scope.groupBySegment.type === 'time') {
        this.getTimesSelectOptions($scope);
      } else {
        this.getTagSelectOptions($scope);
      }

      $scope.agg = fitlerAggs[$scope.index];
      $scope.validateModel();
    };

    $scope.validateModel = () => {
      $scope.index = _.indexOf(fitlerAggs, $scope.agg);
      $scope.isFirst = $scope.index === 0;
      $scope.fitlerAggCount = fitlerAggs.length;
    };

    $scope.addFilterAgg = () => {
      fitlerAggs.push({ type: 'tag', params: [] });
      $scope.onChange();
    };

    $scope.removeFilterAgg = () => {
      fitlerAggs.splice($scope.index, 1);
      $scope.onChange();
    };

    $scope.optionChanged = () => {
      fitlerAggs[$scope.index].params = [$scope.option];

      // if ($scope.groupBySegment.type === 'fill') {
      //   fitlerAggs[$scope.index].params = [$scope.option];
      // } else if ($scope.groupBySegment.type === 'time') {
      //   fitlerAggs[$scope.index].params = [$scope.option];
      // } else {
      //   fitlerAggs[$scope.index].params = [$scope.option];
      // }

      $scope.onChange();
    };

    $scope.init();
  }

  getTimesSelectOptions($scope: any) {
    $scope.groupByOptions = [
      { value: '1s', text: '聚合周期(1m)' },
      { value: '5s', text: '聚合周期(5m)' },
      { value: '10s', text: '聚合周期(10m)' },
    ];
    // 初始化
    $scope.groupBy = 1;
  }

  getFillSelectOptions($scope: any) {
    $scope.groupByOptions = [
      { text: 'none', value: 'none' },
      { text: 'null', value: 'null' },
      { text: '0', value: '0' },
      { text: 'previous', value: 'previous' },
      { text: 'linear', value: 'linear' },
    ];
    // 初始化
    $scope.groupBy = 'none';
  }

  getTagSelectOptions($scope: any) {
    $scope.groupByOptions = [
      { text: 'tag', value: 'anonea' },
      { text: 'tag1', value: 'snullt' },
    ];
    // 初始化
    $scope.groupBy = 'none';
  }
}

export function seraphGroup() {
  return {
    templateUrl: 'public/app/plugins/datasource/zainfo-seraph-monitor/partials/group_by.html',
    controller: seraphGroupCtrl,
    restrict: 'E',
    scope: {
      target: '=',
      index: '=',
      onChange: '&',
      getFields: '&',
      groupBySegment: '=',
    },
  };
}

coreModule.directive('seraphGroupby', seraphGroup);
