import { getTemplateSrv } from '@grafana/runtime';

export const getVariables = () => {
  const templateSrv = getTemplateSrv();
  const variables = templateSrv.getVariables();
  const segments = [];

  for (const variable of variables) {
    segments.unshift('/^$' + variable.name + '$/');
  }

  return segments;
};

export function getMeasurementAndPolicy(mean: string) {
  let measurement = mean || 'measurement';

  if (!measurement.match('^/.*/$')) {
    measurement = '"' + measurement + '"';
  }

  return measurement;
}

export const sqlBuilder = (o: any) => {
  const source = o;
  let sql = 'SELECT ';

  if (source.select) {
    let selectField = source.select.map((field: any) => {
      if (field.fun) {
        let funStr = `"${field.value}"`;

        field.fun.forEach((element: any) => {
          funStr = `${element}(${funStr})`;
        });

        return funStr;
      }

      return `"${field.value}"`;
    });
    sql += selectField.join(',');
  } else {
    sql += 'mean("value")';
  }

  sql += ` FROM ${getMeasurementAndPolicy(source.measurement)} WHERE `;

  //
  if (source.tags) {
    const tags = source.tags.map((tag: any, index: any) => {
      let str = '';
      let operator = tag.operator;
      let value = tag.value;

      if (!value) {
        return;
      }

      if (index > 0) {
        str = (tag.condition || 'AND') + ' ';
      }

      if (!operator) {
        if (/^\/.*\/$/.test(value)) {
          operator = '=~';
        } else {
          operator = '=';
        }
      }

      if (operator !== '>' && operator !== '<') {
        value = "'" + value.replace(/\\/g, '\\\\').replace(/\'/g, "\\'") + "'";
      }

      return str + '"' + tag.key + '" ' + operator + ' ' + value;
    });

    if (tags.length > 0) {
      sql += '(' + tags.join(' ') + ') AND ';
    }
  }

  sql += '$timeFilter';

  //
  if (source.groupBy) {
    let groupby = source.groupBy.map((d: any) => {
      if (d.type === 'tag') {
        return `"${d.value}"`;
      }
      return `${d.type}(${d.value})`;
    });

    if (groupby.length > 0) {
      sql += ' GROUP BY ';
      sql += groupby.join();
    }

    if (source.orderByTime === 'DESC') {
      sql += ' ORDER BY time DESC';
    }
  }

  return sql;
};
