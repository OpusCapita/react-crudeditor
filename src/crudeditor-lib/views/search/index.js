import cloneDeep from 'lodash/cloneDeep';

import { RANGE_FIELD_TYPES } from './constants';
import { buildFieldRender } from '../lib';
import { AUDITABLE_FIELDS } from '../../common/constants';

import {
  FIELD_TYPE_NUMBER,
  FIELD_TYPE_NUMBER_RANGE,
  FIELD_TYPE_STRING_DATE,
  FIELD_TYPE_STRING_DATE_RANGE,
  FIELD_TYPE_STRING_NUMBER,
  FIELD_TYPE_STRING_NUMBER_RANGE
} from '../../../data-types-lib/constants';

export { getViewState } from './selectors';

const rangeFieldType = {
  [FIELD_TYPE_NUMBER]: FIELD_TYPE_NUMBER_RANGE,
  [FIELD_TYPE_STRING_DATE]: FIELD_TYPE_STRING_DATE_RANGE,
  [FIELD_TYPE_STRING_NUMBER]: FIELD_TYPE_STRING_NUMBER_RANGE
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
