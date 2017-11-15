import isEqual from 'lodash/isEqual';
import cloneDeep from 'lodash/cloneDeep';
import { buildViewSelectorWrapper } from '../../selectorWrapper';

import {
  cleanFilter,
  getDefaultSortField
} from './lib';

import {
  DEFAULT_MAX,
  DEFAULT_OFFSET,
  DEFAULT_ORDER,

  VIEW_NAME
} from './constants';

import {
  STATUS_DELETING,
  STATUS_INITIALIZING,
  STATUS_REDIRECTING,
  STATUS_SEARCHING,
} from '../../common/constants';

const wrapper = buildViewSelectorWrapper(VIEW_NAME);

const _getViewState = ({
  resultFilter,
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
    search: searchMeta
  }
}) => {
  const filter = cleanFilter({
    searchableFields: searchMeta.searchableFields,
    filter: resultFilter
  });

  return {
    ...(filter ? { filter } : {}),
    ...(sort === getDefaultSortField(searchMeta) ? {} : { sort }),
    ...(order === DEFAULT_ORDER ? {} : { order }),
    ...(max === DEFAULT_MAX ? {} : { max }),
    ...(offset === DEFAULT_OFFSET ? {} : { offset })
  };
};

export const

  // █████████████████████████████████████████████████████████████████████████████████████████████████████████

  getViewState = wrapper(_getViewState),

  // █████████████████████████████████████████████████████████████████████████████████████████████████████████

  getDefaultNewInstance = wrapper((storeState, modelDefinition) =>
    modelDefinition.ui.create.defaultNewInstance ?
      cloneDeep(modelDefinition.ui.create.defaultNewInstance({
        filter: {}, // Setting filter to empty object if it is not specified in view state.
        ..._getViewState(storeState, modelDefinition)
      })) :
      {}
  ),

  // █████████████████████████████████████████████████████████████████████████████████████████████████████████

  getViewModelData = wrapper((storeState, {
    model: modelMeta,
    ui: uiMeta
  }) => ({
    Spinner: uiMeta.Spinner,
    entityName: modelMeta.name,
    fieldErrors: storeState.errors.fields,
    formFilter: storeState.formFilter,
    formatedFilter: storeState.formatedFilter,
    searchFormChanged: !isEqual(storeState.formFilter, storeState.resultFilter),
    isLoading: !!~[
      STATUS_DELETING,
      STATUS_INITIALIZING,
      STATUS_REDIRECTING,
      STATUS_SEARCHING
    ].indexOf(storeState.status),
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
