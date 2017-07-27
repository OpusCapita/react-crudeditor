import { buildViewSelectorWrapper } from '../../selectorWrapper';
import buildFieldComponent from '../../components/DefaultFieldInput';
import { VIEW_NAME } from './constants';

import {
  AUDITABLE_FIELDS,
  DEFAULT_FIELD_TYPE
} from '../../common/constants';

const wrapper = buildViewSelectorWrapper(VIEW_NAME);

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

  getViewName = _ => VIEW_NAME,

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
        return ui.search().searchableFields.map(field => ({
          Component: buildFieldComponent(fields[field.name].type || DEFAULT_FIELD_TYPE),
          ...field  // field.Component overwrites above default Component if exists.
        }));
      }
    }

    return Object.keys(fields).
      filter(name => !AUDITABLE_FIELDS.includes(name)).
      map(name => ({
        name,
        Component: buildFieldComponent(fields[name].type || DEFAULT_FIELD_TYPE)
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
            type: fields[field.name].type || DEFAULT_FIELD_TYPE
          };
        });
      }
    }

    return Object.keys(fields).map(name => ({
      name,
      type: fields[name].type || DEFAULT_FIELD_TYPE
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

