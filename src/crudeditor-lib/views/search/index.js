import cloneDeep from 'lodash/cloneDeep';

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
  FIELD_TYPE_STRING_DATE_ONLY,
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
  [FIELD_TYPE_STRING_DATE_ONLY]: FIELD_TYPE_STRING_DATE_RANGE,
  [FIELD_TYPE_STRING_INTEGER]: FIELD_TYPE_STRING_INTEGER_RANGE,
  [FIELD_TYPE_STRING_DECIMAL]: FIELD_TYPE_STRING_DECIMAL_RANGE
};

export const getUi = ({ modelDefinition, i18n }) => {
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

  if (!searchMeta.pagination) {
    searchMeta.pagination = {
      defaultMax: 30,
      options: [
        { max: -1, label: i18n.getMessage('common.CrudEditor.search.all') },
        { max: 1000, label: '1000' },
        { max: 100, label: '100' },
        { max: 50, label: '50' },
        { max: 30, label: '30' },
        { max: 10, label: '10' }
      ]
    }
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
        (value => value);
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
