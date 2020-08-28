import _ from 'lodash';
import coreModule from 'app/core/core_module';
import { GrafanaRootScope } from 'app/routes/GrafanaCtrl';
import { seraphSelectUpdated } from './event';

export class seraphGroupCtrl {
  /** @ngInject */
  constructor($scope: any, $rootScope: GrafanaRootScope) {
    const part = $scope.part;
    const partDef = part.def;
    // 值
    const type = part.part.type;
    const segment = $scope.segment;

    function addTypeahead(param: any, index: number) {
      if (!param.options && !param.dynamicLookup) {
        return;
      }

      if (param.options) {
        let options = param.options;

        $scope.options = options.map((f: any) => ({ text: f, value: f }));
        $scope.option = part.params[index];
      }

      if (type === 'tag') {
        $scope.options = $scope.getFields();
        $scope.option = part.params[index];
      }
    }

    function optionChanged(paramIndex: any) {
      part.updateParam($scope.option, paramIndex);
      $scope.handleEvent({ $event: { name: 'get-param-changed' } });
    }

    $rootScope.onAppEvent(
      seraphSelectUpdated,
      () => {
        $scope.validateModel();
      },
      $scope
    );

    $scope.init = () => {
      _.each(partDef.params, (param: any, index: number) => {
        $scope.optionChanged = () => {
          optionChanged(index);
        };

        addTypeahead(param, index);
      });
    };

    $scope.add = () => {
      segment.value = 'tag()';
      $scope.onChange({ $event: { name: 'action' } });
    };

    $scope.remove = () => {
      $scope.handleEvent({ $event: { name: 'action' } });
    };

    $scope.validateModel = () => {
      $scope.validateModel = () => {
        $scope.init();
      };
    };

    $scope.init();
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
      getOptions: '&',
      handleEvent: '&',
      part: '=',
      segment: '=',
      addHandleEvent: '&',
      getFields: '&',
    },
  };
}

coreModule.directive('seraphGroupby', seraphGroup);
