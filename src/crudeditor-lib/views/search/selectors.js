import { buildViewSelectorWrapper } from '../../selectorWrapper';
import { AUDITABLE_FIELDS } from '../../common/constants';
import { cleanFilter } from './lib';

import {
  DELETING,
  INITIALIZING,
  REDIRECTING,
  SEARCHING,
  VIEW_NAME
} from './constants';

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
}, {
  ui: {
    search: { searchableFields }
  }
}) => {
  filter = cleanFilter({ searchableFields, filter });

  return {
    ...(filter ? { filter } : {}),
    sort,
    order,
    max,
    offset
  };
};

export const

  // █████████████████████████████████████████████████████████████████████████████████████████████████████████

  getViewState = wrapper(_getViewState),

  // █████████████████████████████████████████████████████████████████████████████████████████████████████████

  getDefaultNewInstance = wrapper((storeState, modelDefinition) =>
    modelDefinition.ui.create.defaultNewInstance ?
      modelDefinition.ui.create.defaultNewInstance({
        filter: {}, // Setting filter to empty object if it is not specified in view state.
        ..._getViewState(storeState, modelDefinition)
      }) :
      {}
  ),

  // █████████████████████████████████████████████████████████████████████████████████████████████████████████

  getViewModelData = wrapper((storeState, {
    model: modelMeta,
    ui: uiMeta
  }) => ({
    entityName: modelMeta.name,
    fieldErrors: storeState.errors.fields,
    formFilter: storeState.formFilter,
    formatedFilter: storeState.formatedFilter,
    generalErrors: storeState.errors.general,
    isLoading: ~[DELETING, INITIALIZING, REDIRECTING, SEARCHING].indexOf(storeState.status),
    pageParams: {
      max: storeState.pageParams.max,
      offset: storeState.pageParams.offset
    },
    resultFields: uiMeta.search.resultFields,
    resultFilter: storeState.resultFilter,
    resultInstances: storeState.resultInstances,
    searchableFields: uiMeta.search.searchableFields.map(({
      name,
      render: {
        Component,
        isRange,
        valueProp: {
          name: valuePropName
        }
      }
    }) => ({
      name,
      isRange,
      Component,
      valuePropName
    })),
    selectedInstances: storeState.selectedInstances,
    sortParams: {
      field: storeState.sortParams.field,
      order: storeState.sortParams.order
    },
    status: storeState.status,
    totalCount: storeState.totalCount
  }));
