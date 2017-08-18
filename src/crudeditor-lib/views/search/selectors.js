import { buildViewSelectorWrapper } from '../../selectorWrapper';
import buildFieldComponent from '../../components/DefaultFieldInput';
import { VIEW_NAME } from './constants';

import {
  AUDITABLE_FIELDS,
  DEFAULT_FIELD_TYPE
} from '../../common/constants';

const wrapper = buildViewSelectorWrapper(VIEW_NAME);

const _getResultFiels = (fields, ui) => {
  if (ui.search) {
    const resultFields = ui.search().resultFields;

    if (resultFields) {
      return resultFields.map(field => {
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
};

const _getSearchableFields = (fields, ui) => {
  if (ui.search) {
    const searchableFields = ui.search().searchableFields;

    if (searchableFields) {
      return searchableFields.map(field => ({
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
};

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

  getViewState = wrapper(_getViewState),

  // █████████████████████████████████████████████████████████████████████████████████████████████████████████

  getViewModelData = wrapper((storeState, {
    model: modelConfig,
    ui: uiConfig
  }) => ({
    defaultNewInstance: uiConfig.defaultNewInstance && uiConfig.defaultNewInstance(_getViewState(storeState)),
    entityName: modelConfig.name,
    formFilter: storeState.formFilter,
    pageParams: {
      max: storeState.pageParams.max,
      offset: storeState.pageParams.offset
    },
    resultFields: _getResultFiels(modelConfig.fields, uiConfig),
    resultFilter: storeState.resultFilter,
    resultInstances: storeState.resultInstances,
    searchableFields: _getSearchableFields(modelConfig.fields, uiConfig),
    selectedInstances: storeState.selectedInstances,
    sortParams: {
      field: storeState.sortParams.field,
      order: storeState.sortParams.order
    },
    totalCount: storeState.totalCount
  }));
