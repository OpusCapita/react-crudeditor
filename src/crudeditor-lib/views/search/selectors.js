import { VIEW_NAME } from './constants';
import { buildViewSelectorWrapper } from '../../lib';

import {
  DEFAULT_FIELD_TYPE,
  AUDITABLE_FIELDS
} from './constants';

const wrapper = buildViewSelectorWrapper(VIEW_NAME);

const getFieldType = (fields, name) => {
  if (!fields.hasOwnProperty(name)) {
    throw new Error(`Unknown field ${name}`);
  }

  return fields[name].type || DEFAULT_FIELD_TYPE;
}

const _getViewState = ({
  resultFilter: filter,
  sortParams: {
    field: sort,
    order
  },
  pageParams: {
    max,
    offset
  }
}) => ({
  filter,
  sort,
  order,
  max,
  offset
});

export const

  // █████████████████████████████████████████████████████████████████████████████████████████████████████████

  getStatus = wrapper(({ status }) => status),

  // █████████████████████████████████████████████████████████████████████████████████████████████████████████

  getViewState = wrapper(_getViewState),

  // █████████████████████████████████████████████████████████████████████████████████████████████████████████

  getResultFilter = wrapper(({ resultFilter }) => resultFilter),

  // █████████████████████████████████████████████████████████████████████████████████████████████████████████

  getFormFilter = wrapper(({ formFilter }) => formFilter),

  // █████████████████████████████████████████████████████████████████████████████████████████████████████████

  getSortField = wrapper(({
    sortParams: {
      field
    }
  }) => field),

  // █████████████████████████████████████████████████████████████████████████████████████████████████████████

  getSortOrder = wrapper(({
    sortParams: {
      order
    }
  }) => order),

  // █████████████████████████████████████████████████████████████████████████████████████████████████████████

  getPageMax = wrapper(({
    pageParams: {
      max
    }
  }) => max),

  // █████████████████████████████████████████████████████████████████████████████████████████████████████████

  getPageOffset = wrapper(({
    pageParams: {
      offset
    }
  }) => offset),

  // █████████████████████████████████████████████████████████████████████████████████████████████████████████

  getSearchableFields = wrapper((_, {
      model: {
        fields
      },
      ui
  }) => {
    if (ui && ui.search) {
      const searchableFields = ui.search().searchableFields;

      if (searchableFields) {
        return ui.search().searchableFields.map(field => field.Component ?
          field :
          { ...field, type: getFieldType(fields, field.name) }
        );
      }
    }

    return Object.keys(fields).
      filter(name => !AUDITABLE_FIELDS.includes(name)).
      map(name => ({
        name,
        type: getFieldType(fields, name)
      }));
  }),

  // █████████████████████████████████████████████████████████████████████████████████████████████████████████

  getResultFields = wrapper((_, {
      model: {
        fields
      },
      ui
  }) => {
    if (ui && ui.search) {
      const resultFields = ui.search().resultFields;

      if (resultFields) {
        return ui.search().resultFields.map(field => {
          if (field.Component) {
            return field;
          }

          if (!fields.hasOwnProperty(field.name)) {
            throw `Composite field ${field.name} must have FieldRenderComponent specified`;
          }

          return {
            ...field,
            type: getFieldType(fields, field.name)
          };
        });
      }
    }

    return Object.keys(fields).map(name => ({
      name,
      type: getFieldType(fields, name)
    }));
  }),

  // █████████████████████████████████████████████████████████████████████████████████████████████████████████

  getTotalCount = wrapper(({ totalCount }) => totalCount),

  // █████████████████████████████████████████████████████████████████████████████████████████████████████████

  getResultInstances = wrapper(({ resultInstances }) => resultInstances),

  // █████████████████████████████████████████████████████████████████████████████████████████████████████████

  getSelectedInstances = wrapper(({ selectedInstances }) => selectedInstances),

  // █████████████████████████████████████████████████████████████████████████████████████████████████████████

  getDefaultNewInstance = wrapper((storeState, { ui }) => ui &&
    ui.defaultNewInstance &&
    ui.defaultNewInstance(_getViewState(storeState))
  );

