import React from 'react';

import { Button, HorizontalGroup, Form, Field, InputControl, RadioButtonGroup } from '@grafana/ui';

import { SaveDashboardFormProps } from '../types';
import { roles, saveToSeraph } from './seraph';

export const SaveDashboardForm: React.FC<SaveDashboardFormProps> = ({
  seraph,
  dashboard,
  onCancel,
  onSuccess,
  onSubmit,
}) => {
  const defaultValues = {
    role: dashboard.seraph.role,
  };

  const onSubmitChange = async (data: any) => {
    if (!onSubmit) {
      return;
    }

    let q = {};
    try {
      q = JSON.parse(seraph);
    } catch (err) {
      q = { q: seraph };
    }

    let dash: any = dashboard;
    dash.seraph = {
      ...dashboard.seraph,
      role: data.role,
      ...q,
    };

    const result = await onSubmit(dashboard.getSaveModelClone(data), data, dash);
    if (result.status === 'success') {
      onSuccess();
      // callback

      const params: any = {
        role: data.role,
        ...result,
        ...q,
        // gengxing
        action: 1,
      };

      saveToSeraph(params);
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
