import { getDatasourceSrv } from 'app/features/plugins/datasource_srv';

export const saveToSeraph = async (params: any) => {
  const dataSource: any = await getDatasourceSrv().get('seraph-monitor-datasource');
  if (!dataSource.sendDashboardData) {
    return;
  }
  dataSource.sendDashboardData(params);
};

export const roles = [
  { label: '个人', value: 'P' },
  { label: '部门', value: 'D' },
  { label: '公司', value: 'C' },
];
