import cloneDeep from 'lodash/cloneDeep';

import { buildFieldRender } from '../lib';
import { AUDITABLE_FIELDS } from '../../common/constants';
export { getViewState } from './selectors';

import {
  FIELD_TYPE_DECIMAL,
  FIELD_TYPE_DECIMAL_RANGE,
  FIELD_TYPE_INTEGER,
  FIELD_TYPE_INTEGER_RANGE,
  FIELD_TYPE_STRING_DATE,
  FIELD_TYPE_STRING_DATE_RANGE,
  FIELD_TYPE_STRING_INTEGER,
  FIELD_TYPE_STRING_INTEGER_RANGE,
  FIELD_TYPE_STRING_DECIMAL,
  FIELD_TYPE_STRING_DECIMAL_RANGE
} from '../../../data-types-lib/constants';

const rangeFieldType = {
  [FIELD_TYPE_INTEGER]: FIELD_TYPE_INTEGER_RANGE,
  [FIELD_TYPE_DECIMAL]: FIELD_TYPE_DECIMAL_RANGE,
  [FIELD_TYPE_STRING_DATE]: FIELD_TYPE_STRING_DATE_RANGE,
  [FIELD_TYPE_STRING_INTEGER]: FIELD_TYPE_STRING_INTEGER_RANGE,
  [FIELD_TYPE_STRING_DECIMAL]: FIELD_TYPE_STRING_DECIMAL_RANGE
};

export const getUi = modelDefinition => {
  const fieldsMeta = modelDefinition.model.fields;

  const searchMeta = modelDefinition.ui.search ?
    cloneDeep(modelDefinition.ui.search()) :
    {};

  if (!searchMeta.resultFields) {
    searchMeta.resultFields = Object.keys(fieldsMeta).map(name => ({ name }));
  }

  if (!searchMeta.searchableFields) {
    searchMeta.searchableFields = Object.keys(fieldsMeta).
      filter(name => AUDITABLE_FIELDS.indexOf(name) === -1).
      map(name => ({ name }));
  }

  searchMeta.searchableFields.forEach(field => {
    if (field.render && !field.render.Component) {
      throw new Error(`searchableField "${field.name}" must have render.Component since custom render is specified`);
    }

    const fieldType = fieldsMeta[field.name].type;

    field.render = buildFieldRender({ // eslint-disable-line no-param-reassign
      render: field.render,
      type: rangeFieldType[fieldType] || fieldType
    });
  });

  return searchMeta;
}
