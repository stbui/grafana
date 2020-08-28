// @ts-nocheck
import { DataSourcePlugin } from '@grafana/data';
import SeraphDatasource from './datasource';
import { ConfigEditor } from './components/ConfigEditor';
import { QueryEditor } from './components/QueryEditor';
import InfluxStartPage from './components/InfluxStartPage';

class InfluxAnnotationsQueryCtrl {
  static templateUrl = 'partials/annotations.editor.html';
}

export const plugin = new DataSourcePlugin(SeraphDatasource)
  .setConfigEditor(ConfigEditor)
  .setQueryEditor(QueryEditor)
  .setAnnotationQueryCtrl(InfluxAnnotationsQueryCtrl)
  .setExploreStartPage(InfluxStartPage);
