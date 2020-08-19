import _ from 'lodash';
import coreModule from 'app/core/core_module';
import { GrafanaRootScope } from 'app/routes/GrafanaCtrl';
import { seraphSelectUpdated } from './event';

export class serapSelectCtrl {
  /** @ngInject */
  constructor($scope: any, uiSegmentSrv: any, $rootScope: GrafanaRootScope) {
    const part = $scope.part;
    const partDef = part.def;
    // 值
    const type = part.part.type;

    console.log('serapSelectCtrl', part);

    $rootScope.onAppEvent(
      seraphSelectUpdated,
      () => {
        $scope.validateModel();
      },
      $scope
    );

    function addTypeahead(param: any, index: number) {
      if (!param.options && !param.dynamicLookup) {
        return;
      }

      if (param.options) {
        let options = param.options;

        $scope.options = options.map((f: any) => ({ text: f, value: f }));
      }

      if (type === 'field') {
        $scope.options = $scope.getFields();
      }

      $scope.option = part.params[index];
    }

    function optionChanged(paramIndex: any) {
      part.updateParam($scope.option, paramIndex);
      $scope.handleEvent({ $event: { name: 'get-param-changed' } });
    }

    $scope.init = () => {
      _.each(partDef.params, (param: any, index: number) => {
        console.log(param, index);

        $scope.optionChanged = () => {
          optionChanged(index);
        };

        addTypeahead(param, index);
      });

      if (type === 'mean') {
        $scope.options = [
          { text: 'mean()', value: 'mean' },
          { text: 'count()', value: 'count' },
          { text: 'sum()', value: 'sum' },
        ];
        $scope.option = type;
        $scope.optionChanged = () => $scope.addSelect({ $event: { value: $scope.option } });
      }
    };

    $scope.add = () => {
      $scope.addSelect({ $event: { value: 'field' } });
    };

    $scope.remove = () => {
      $scope.handleEvent({ $event: { name: 'action' } });
    };

    $scope.validateModel = () => {
      $scope.init();
    };

    $scope.init();
  }
}

export function seraphSelect() {
  return {
    templateUrl: 'public/app/plugins/datasource/zainfo-seraph-monitor/partials/select.html',
    controller: serapSelectCtrl,
    restrict: 'E',
    scope: {
      target: '=',
      index: '=',
      getFields: '&',
      addSelect: '&',
      handleEvent: '&',
      part: '=',
    },
  };
}

coreModule.directive('seraphSelect', seraphSelect);
