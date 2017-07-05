import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import * as u from 'updeep';

import {
  INSTANCES_SEARCH,
  INSTANCES_SEARCH_REQUEST,
  INSTANCES_SEARCH_COMPLETE
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
  totalCount: undefined
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

  defaultStoreState.formFilter = (
    searchableFieldsMeta &&
    searchableFieldsMeta.map(({ name }) => name) ||
    Object.keys(entityConfiguration.model.fields)
  ).reduce(
    (rez, fieldName) => ({
      ...rez,
      [fieldName]: null
    }),
    {}
  );

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

    } else if (type === INSTANCES_SEARCH_COMPLETE) {
      if (error) {

      }
    }
    if (type === 'FILTER_ENTITIES_DONE_SUCCESS') {
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

    // ███████████████████████████████████████████████████████████████████████████████████████████████████████████

    } else if (type === 'FILTER_ENTITIES_DONE_FAILURE') {
      newStoreStateSlice.err = payload.err;

    // ███████████████████████████████████████████████████████████████████████████████████████████████████████████

    } else if (type === 'SELECT_ENTITY') {
      newStoreStateSlice.selectedInstances = storeState.selectedInstances.concat([payload.entity]);

    // ███████████████████████████████████████████████████████████████████████████████████████████████████████████

    } else if (type === 'DESELECT_ENTITY') {
      newStoreStateSlice.selectedInstances = storeState.selectedInstances.filter(
        entity => entity !== payload.entity
      )

    // ███████████████████████████████████████████████████████████████████████████████████████████████████████████

    } else if (type === 'SELECT_ALL_ENTITIES') {
      newStoreStateSlice.selectedInstances = storeState.resultInstances;

    // ███████████████████████████████████████████████████████████████████████████████████████████████████████████

    } else if (type === 'DESELECT_ALL_ENTITIES') {
      newStoreStateSlice.selectedInstances = [];

    // ███████████████████████████████████████████████████████████████████████████████████████████████████████████

    } else if (type === 'DELETE_ENTITIES_DONE_SUCCESS') {
      const isDeleted = entity =>
        payload.entityIds.some(entityId =>
          entityId === entity[entityConfiguration.search.result.fields[0].name]
        );

      let newInstances = storeState.selectedInstances.filter(entity => !isDeleted(entity));

      // XXX: updeep-package does not check arrays for equality.
      if (newInstances.length !== storeState.selectedInstances.length) {
        newStoreStateSlice.selectedInstances = newInstances;
      }

      newInstances = storeState.resultInstances.filter(entity => !isDeleted(entity));

      // XXX: updeep-package does not check arrays for equality.
      if (newInstances.length !== storeState.resultInstances.length) {
        newStoreStateSlice.resultInstances = newInstances;
      }

    // ███████████████████████████████████████████████████████████████████████████████████████████████████████████

    } else if (type === 'RESET_RAW_FILTER') {
      newStoreStateSlice.formFilter = Object.keys(storeState.formFilter).reduce(
        (rez, field) => ({
          ...rez,
          [field]: null
        }),
        {}
      );

    // ███████████████████████████████████████████████████████████████████████████████████████████████████████████

    } else if (type === 'UPDATE_RAW_FILTER') {
      newStoreStateSlice.formFilter = {
        [payload.fieldName]: payload.fieldValue
      };

    // ███████████████████████████████████████████████████████████████████████████████████████████████████████████
    }

    return u(newStoreStateSlice, storeState);  // returned object is frozen for NODE_ENV === 'development'
  };
}
