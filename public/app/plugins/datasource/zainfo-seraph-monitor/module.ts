import SeraphDatasource from './datasource';
import { SeraphQueryCtrl } from './query_ctrl';
import { DataSourcePlugin } from '@grafana/data';
import ConfigEditor from './components/ConfigEditor';

export const plugin = new DataSourcePlugin(SeraphDatasource)
  .setConfigEditor(ConfigEditor)
  .setQueryCtrl(SeraphQueryCtrl);
