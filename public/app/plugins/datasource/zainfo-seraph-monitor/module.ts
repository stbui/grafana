import SeraphDatasource from './datasource';
import { SeraphQueryCtrl } from './query_ctrl';
import { DataSourcePlugin } from '@grafana/data';
import ConfigEditor from './components/ConfigEditor';

class InfluxAnnotationsQueryCtrl {
  static templateUrl = 'partials/annotations.editor.html';
}

export const plugin = new DataSourcePlugin(SeraphDatasource)
  .setConfigEditor(ConfigEditor)
  .setQueryCtrl(SeraphQueryCtrl)
  .setAnnotationQueryCtrl(InfluxAnnotationsQueryCtrl);
