export const saveToSeraph = (params: any) => {
  const url = '/dashboard/create';
  fetch(url, {
    method: 'POST',
    body: JSON.stringify(params),
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const roles = [
  { label: '个人', value: '1' },
  { label: '部门', value: '2' },
  { label: '公司', value: '3' },
];
