import cloneDeep from 'lodash/cloneDeep';

import { RANGE_FIELD_TYPES } from './constants';
import { buildFieldRender } from '../lib';
import { AUDITABLE_FIELDS } from '../../common/constants';

export { getViewState } from './selectors';

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
    if (field.render) {
      if (!field.render.Component) {
        throw new Error(`searchableField "${field.name}" must have render.Component since custom render is specified`);
      }
      if (field.render.hasOwnProperty('isRange')) {
        // field.render has isRange and it is set to true.
        throw new Error(
          `searchableField "${field.name}" must not have render.isRange since custom render is specified`
        );
      }
    }

    field.render = { // eslint-disable-line no-param-reassign
      isRange: field.render ?
        false :
        RANGE_FIELD_TYPES.indexOf(fieldsMeta[field.name].type) !== -1,

      ...buildFieldRender({
        render: field.render,
        type: fieldsMeta[field.name].type
      }),
    };
  });

  return searchMeta;
}
