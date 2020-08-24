import React from 'react';

import { Button, HorizontalGroup, Form, Field, InputControl, RadioButtonGroup } from '@grafana/ui';

import { SaveDashboardFormProps } from '../types';

const saveToSeraph = (params: any) => {
  const url = '/dashboard/create';
  fetch(url, {
    method: 'POST',
    body: JSON.stringify(params),
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

const roles = [
  { label: '个人', value: '1' },
  { label: '部门', value: '2' },
  { label: '公司', value: '3' },
];

export const SaveDashboardForm: React.FC<SaveDashboardFormProps> = ({ dashboard, onCancel, onSuccess, onSubmit }) => {
  const defaultValues = {
    role: dashboard.seraph.role,
  };

  const onSubmitChange = async (data: any) => {
    if (!onSubmit) {
      return;
    }

    let d: any = dashboard;
    d.seraph = {
      ...dashboard.seraph,
      role: data.role,
    };

    const result = await onSubmit(dashboard.getSaveModelClone(data), data, d);
    if (result.status === 'success') {
      onSuccess();
      // callback

      const seraph: any = {
        role: data.role,
        title: result.title,
        id: result.id,
        uid: result.uid,
        url: result.url,
      };

      saveToSeraph(seraph);
    }
  };

  return (
    <Form defaultValues={defaultValues} onSubmit={onSubmitChange}>
      {({ register, control, errors, getValues }) => (
        <>
          <Field label="权限设置">
            <InputControl as={RadioButtonGroup} control={control} options={roles} name="role" />
          </Field>
          <HorizontalGroup>
            <Button type="submit">保存</Button>
            <Button variant="secondary" onClick={onCancel}>
              取消
            </Button>
          </HorizontalGroup>
        </>
      )}
    </Form>
  );
};
