import cloneDeep from 'lodash/cloneDeep';

import { buildFieldRender } from '../lib';
import { converter } from '../../../data-types-lib';
import { checkSearchUi } from '../../lib';

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
  FIELD_TYPE_STRING_DECIMAL_RANGE,

  UI_TYPE_STRING
} from '../../../data-types-lib/constants';

export { getViewState } from './selectors';

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

  checkSearchUi(searchMeta);

  if (!searchMeta.resultFields) {
    searchMeta.resultFields = Object.keys(fieldsMeta).map(name => ({ name }));
  }

  searchMeta.resultFields.
    filter(({ component }) => !component).
    forEach(field => {
      if (!fieldsMeta[field.name]) {
        throw new Error(`Composite field "${field.name}" in resultFields must have "component" property`);
      }

      const defaultConverter = converter({
        fieldType: fieldsMeta[field.name].type,
        uiType: UI_TYPE_STRING
      });

      // eslint-disable-next-line no-param-reassign
      field.format = defaultConverter ?
        defaultConverter.format :
        (({ value }) => value);
    });

  if (!searchMeta.searchableFields) {
    searchMeta.searchableFields = Object.keys(fieldsMeta).
      map(name => ({ name }));
  }

  searchMeta.searchableFields.forEach(field => {
    if (field.render && !field.render.component) {
      throw new Error(`searchableField "${field.name}" must have render.component since custom render is specified`);
    }

    const fieldType = fieldsMeta[field.name].type;

    field.render = buildFieldRender({ // eslint-disable-line no-param-reassign
      render: field.render,
      type: !field.render && rangeFieldType[fieldType] || fieldType
    });
  });

  return searchMeta;
}
