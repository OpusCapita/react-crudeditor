import { cloneDeep } from 'lodash-es';

import { buildFieldRender } from '../lib';
export { getViewState } from './selectors';
import { converter } from '../../../data-types-lib';
import { checkSearchUi } from '../../check-model';

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
    searchMeta.searchableFields = Object.keys(fieldsMeta).map(name => ({ name }));
  }

  checkSearchUi({ searchMeta, fieldsMeta });

  searchMeta.resultFields.
    filter(({ component }) => !component).
    forEach(field => {
      const defaultConverter = converter({
        fieldType: fieldsMeta[field.name].type,
        uiType: UI_TYPE_STRING
      });

      // eslint-disable-next-line no-param-reassign
      field.format = defaultConverter ?
        defaultConverter.format :
        (({ value }) => value);
    });

  searchMeta.searchableFields.forEach(field => {
    const fieldType = fieldsMeta[field.name].type;

    field.render = buildFieldRender({ // eslint-disable-line no-param-reassign
      render: field.render,
      type: !field.render && rangeFieldType[fieldType] || fieldType
    });
  });

  return searchMeta;
}
