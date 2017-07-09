import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import * as u from 'updeep';

import {
  FORM_FILTER_RESET,
  FORM_FILTER_UPDATE,
  INSTANCES_SEARCH_FAIL,
  INSTANCES_SEARCH_REQUEST,
  INSTANCES_SEARCH_SUCCESS
} from './constants';

import {
  UNINITIALIZED,
  SEARCHING,
  READY
} from './constants';

const defaultStoreStateTemplate = {
  resultFilter: undefined,  // Active filter as displayed in Search Result and sent to URL/server.
  formFilter: {},  // Filter as displayed in Search Criteria.
  sortParams: {
    field: undefined,
    order: 'asc'
  },
  pageParams: {
    max: 30,
    offset: 0
  },
  resultInstances: undefined,  // XXX: must be undefined until first extraction.
  selectedInstances: [],  // XXX: must be a sub-array of refs from resultInstances.
  totalCount: undefined,
  status = UNINITIALIZED;
};

/*
 * XXX:
 * Only objects and arrays are allowed at branch nodes.
 * Only primitive data types are allowed at leaf nodes.
 */
export default entityConfiguration => {
  const defaultStoreState = cloneDeep(defaultStoreStateTemplate);

  const searchableFieldsMeta = entityConfiguration.ui &&
    entityConfiguration.ui.search &&
    entityConfiguration.ui.search().searchableFields;

  const getDefaultFormFilter = _ => (
    searchableFieldsMeta &&
      searchableFieldsMeta.map(({
        name,
        Component
      }) => ({
        name,
        Component
      })) ||
    Object.keys(entityConfiguration.model.fields).map(name => ({
      name,
      type: entityConfiguration.model.fields.type || 'string'
    }))
  ).reduce(
    (rez, {
      name,
      Component,
      type
    }) => ({
      ...rez,
      [name]: do {
        if (Component) { null; }
        else if (type === 'string') { ''; }
        else if (type === 'number') { ''; }
        else if (type === 'date') { null; }
        else if (type === 'boolean') { null; }
        else { throw new Error('Unknown field type ' + type); }
      }
    }),
    {}
  );

  defaultStoreState.formFilter = getDefaultFormFilter();

  const resultFieldsMeta = entityConfiguration.ui &&
    entityConfiguration.ui.search &&
    entityConfiguration.ui.search().resultFields;

  defaultStoreState.sortParams.field = resultFieldsMeta ?
    resultFieldsMeta[resultFieldsMeta.findIndex(field => field.hasOwnProperty('sortByDefault')) || 0].name :
    Object.keys(entityConfiguration.model.fields)[0];

  return (storeState = defaultStoreState, { type, payload, error, meta }) => {
    const newStoreStateSlice = {};

    // ███████████████████████████████████████████████████████████████████████████████████████████████████████████

    if (type === INSTANCES_SEARCH_REQUEST) {
      newStoreStateSlice.status = SEARCHING;

    // ███████████████████████████████████████████████████████████████████████████████████████████████████████████

    } else if (type === INSTANCES_SEARCH_SUCCESS) {
      const {
        filter,
        sort,
        order,
        max,
        offset,
        instances,
        totalCount
      } = payload;

      newStoreStateSlice = {
        resultFilter: filter,
        sortParams: {
          field: sort,
          order
        }
        pageParams: {
          max,
          offset
        }
      };

      newStoreStateSlice.totalCount = totalCount;

      // XXX: updeep-package does not check arrays for equality.
      if (!isEqual(instances, storeState.resultInstances)) {
        newStoreStateSlice.resultInstances = instances;
        newStoreStateSlice.selectedInstances = [];
      }

      newStoreStateSlice.status = READY;

    // ███████████████████████████████████████████████████████████████████████████████████████████████████████████

    } else if (type === INSTANCES_SEARCH_FAIL) {
      newStoreStateSlice.status = storeState.resultInstances ? READY : UNINITIALIZED;

    // ███████████████████████████████████████████████████████████████████████████████████████████████████████████

    } else if (type === FORM_FILTER_RESET) {
      newStoreStateSlice.formFilter = getDefaultFormFilter();

    // ███████████████████████████████████████████████████████████████████████████████████████████████████████████

    } else if (type === FORM_FILTER_UPDATE) {
      const {
        name: fieldName,
        value: fieldValue
      } = payload;

      newStoreStateSlice.formFilter = {
        [fieldName]: fieldValue
      };

    // ███████████████████████████████████████████████████████████████████████████████████████████████████████████
    }

    return u(newStoreStateSlice, storeState);  // returned object is frozen for NODE_ENV === 'development'
  };
}
