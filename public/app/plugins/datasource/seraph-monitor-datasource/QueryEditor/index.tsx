// @ts-nocheck
import React, { PureComponent, useEffect, useState } from 'react';
import { QueryEditorProps, SelectableValue } from '@grafana/data';
import { Select, LinkButton, InlineFormLabel } from '@grafana/ui';

import { InfluxQuery, InfluxOptions } from '../types';

import From from './From';
import SelectField from './SelectField';
import Groupby from './Groupby';
import Where from './Where';
import Alias from './Alias';
import { sqlBuilder } from './util';

const Query = ({ defaultValue, data, onQuery }) => {
  const [state, setState] = useState({ filed: [], tag: [] });

  const onFromChange = (metric, options, isInit) => {
    setState(options);

    if (isInit) {
      return;
    }

    onQuery && onQuery(metric);
  };

  const onSelectFieldChange = value => {
    onQuery &&
      onQuery({
        select: value,
      });
  };

  const onGroupbyChange = value => {
    onQuery &&
      onQuery({
        groupBy: value,
      });
  };

  const onWhereChange = value => {
    onQuery &&
      onQuery({
        tags: value,
      });
  };

  const onAliasChange = value => {
    onQuery &&
      onQuery({
        alias: value,
      });
  };

  return (
    <div>
      <From defaultValue={defaultValue} data={data} onChange={onFromChange} />
      <SelectField defaultValue={defaultValue.select} filed={state.filed} onChange={onSelectFieldChange} />
      <Groupby defaultValue={defaultValue.groupBy} tag={[]} onChange={onGroupbyChange} />
      <Where defaultValue={defaultValue.tags} filed={state.tag} onChange={onWhereChange} />
      <Alias defaultValue={defaultValue.alias} value={state.filed} onChange={onAliasChange} />
    </div>
  );
};

export const QueryEditor = props => {
  const { datasource, query, onChange, onRunQuery } = props;
  let _query = query;

  if (Object.keys(query).length < 2) {
    _query = {
      groupBy: [{ type: 'time', value: '1m', label: '聚合时间(1m)', index: Math.random() }],
      select: [{ value: 'value', label: 'value', fun: 'mean', index: Math.random() }],
    };

    _query.query = sqlBuilder(_query);
  }

  const [sql, setSql] = useState(_query.query);

  console.log(1111, query);

  const [state, setState] = useState({
    data: undefined,
    error: null,
    total: null,
    loading: true,
    loaded: false,
  });

  useEffect(() => {
    datasource
      .getSeraphMonitor()
      .then(data => {
        setState({
          data,
          loading: false,
          loaded: true,
        });
      })
      .catch(error => {
        setState({
          error,
          loading: false,
          loaded: false,
        });
      });
  }, []);

  if (state.loading) {
    return state.loading;
  }

  const onQuery = (value: any) => {
    const target = {
      ...query,
      ...value,
      raw: false,
    };

    // 转化为sql
    const q = sqlBuilder(target);
    target.query = q;

    setSql(q);

    onChange(target);
    onRunQuery();
  };

  const onInputChange = ({ target: { value } }) => {
    const target = {
      ...query,
      query: value,
      raw: true,
    };
    setSql(value);

    onChange(target);
    onRunQuery();
  };

  return (
    <div>
      <div className="gf-form-inline">
        <div className="gf-form gf-form--grow">
          <textarea value={sql} rows="3" className="gf-form-input" onChange={onInputChange}></textarea>
        </div>
      </div>

      <Query defaultValue={_query} data={state.data} onQuery={onQuery} />
    </div>
  );
};
