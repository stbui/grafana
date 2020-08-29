// @ts-nocheck
import SeraphDatasource from './datasource';
import { DataSourcePlugin } from '@grafana/data';
import ConfigEditor from './ConfigEditor';
import { QueryEditor } from './QueryEditor';

export const plugin = new DataSourcePlugin(SeraphDatasource).setConfigEditor(ConfigEditor).setQueryEditor(QueryEditor);
