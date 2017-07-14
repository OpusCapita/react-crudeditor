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

export const

  // █████████████████████████████████████████████████████████████████████████████████████████████████████████

  getEntityName = wrapper((_, {
    model: { name }
  }) => name),

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
  }) => ui &&
    ui.search &&
    ui.search().searchableFields &&
    ui.search().searchableFields.map(field => field.Component ?
      field :
      { ...field, type: getFieldType(fields, field.name) }
    ) ||
    Object.keys(fields).
      filter(name => !AUDITABLE_FIELDS.includes(name)).
      map(name => ({
        name,
        type: getFieldType(fields, name)
      }))
  ),

  // █████████████████████████████████████████████████████████████████████████████████████████████████████████

  getResultFields = wrapper((_, {
      model: {
        fields
      },
      ui
  }) => ui &&
    ui.search &&
    ui.search().resultFields &&
    ui.search().resultFields.map(field => {
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
    }) ||
    Object.keys(fields).map(name => ({
      name,
      type: getFieldType(fields, name)
    }))
  ),

  // █████████████████████████████████████████████████████████████████████████████████████████████████████████

  getTotalCount = wrapper(({ totalCount }) => totalCount),

  // █████████████████████████████████████████████████████████████████████████████████████████████████████████

  getResultInstances = wrapper(({ resultInstances }) => resultInstances),

  // █████████████████████████████████████████████████████████████████████████████████████████████████████████

  getSelectedInstances = wrapper(({ selectedInstances }) => selectedInstances);
