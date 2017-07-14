import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import * as u from 'updeep';

import {
  ALL_INSTANCES_SELECT,
  ALL_INSTANCES_DESELECT,

  EMPTY_FILTER_VALUE,

  FORM_FILTER_RESET,
  FORM_FILTER_UPDATE,

  INSTANCES_DELETE_FAIL,
  INSTANCES_DELETE_REQUEST,
  INSTANCES_DELETE_SUCCESS,

  INSTANCES_SEARCH_FAIL,
  INSTANCES_SEARCH_REQUEST,
  INSTANCES_SEARCH_SUCCESS,

  INSTANCE_SELECT,
  INSTANCE_DESELECT,

  DELETING,
  READY,
  SEARCHING,
  UNINITIALIZED
} from './constants';

const defaultStoreStateTemplate = {
  resultFilter: {},  // Active filter as displayed in Search Result and sent to URL/server.
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
  status: UNINITIALIZED
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

  const buildDefaultFormFilter = _ => (
    searchableFieldsMeta &&
    searchableFieldsMeta.map(({ name }) => name) ||
    Object.keys(entityConfiguration.model.fields)
  ).reduce(
    (rez, name) => ({
      ...rez,
      [name]: EMPTY_FILTER_VALUE
    }),
    {}
  );

  defaultStoreState.formFilter = buildDefaultFormFilter();
  defaultStoreState.resultFilter = cloneDeep(defaultStoreState.formFilter);

  const resultFieldsMeta = entityConfiguration.ui &&
    entityConfiguration.ui.search &&
    entityConfiguration.ui.search().resultFields;

  if (resultFieldsMeta) {
    const sortByDefaultIndex = resultFieldsMeta.findIndex(field => field.hasOwnProperty('sortByDefault'));

    defaultStoreState.sortParams.field = resultFieldsMeta[sortByDefaultIndex === -1 ?
      0 :
      sortByDefaultIndex
    ].name;
  } else {
    defaultStoreState.sortParams.field = Object.keys(entityConfiguration.model.fields)[0];
  }

  return (storeState = defaultStoreState, { type, payload, error, meta }) => {
    const newStoreStateSlice = {};

    // ███████████████████████████████████████████████████████████████████████████████████████████████████████

    if (type === INSTANCES_SEARCH_REQUEST) {
      newStoreStateSlice.status = SEARCHING;

    // ███████████████████████████████████████████████████████████████████████████████████████████████████████

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

      newStoreStateSlice.formFilter = cloneDeep(filter);
      newStoreStateSlice.resultFilter = cloneDeep(filter);
      newStoreStateSlice.sortParams = {
        field: sort,
        order
      };
      newStoreStateSlice.pageParams = {
        max,
        offset
      };
      newStoreStateSlice.totalCount = totalCount;

      // XXX: updeep-package does not check arrays for equality.
      if (!isEqual(instances, storeState.resultInstances)) {
        newStoreStateSlice.resultInstances = instances;
        newStoreStateSlice.selectedInstances = [];
      }

      newStoreStateSlice.status = READY;

    // ███████████████████████████████████████████████████████████████████████████████████████████████████████

    } else if (type === INSTANCES_DELETE_REQUEST) {
      newStoreStateSlice.status = DELETING;

    // ███████████████████████████████████████████████████████████████████████████████████████████████████████

    } else if (type === INSTANCES_DELETE_SUCCESS) {
      const { instances } = payload;
      newStoreStateSlice.selectedInstances = storeState.selectedInstances.filter(ins => !instances.includes(ins));
      newStoreStateSlice.resultInstances = storeState.resultInstances.filter(ins => !instances.includes(ins));
      newStoreStateSlice.totalCount = storeState.totalCount - instances.length;
      newStoreStateSlice.status = READY;

    // ███████████████████████████████████████████████████████████████████████████████████████████████████████

    } else if (type === INSTANCES_DELETE_FAIL) {
      newStoreStateSlice.status = READY;

    // ███████████████████████████████████████████████████████████████████████████████████████████████████████

    } else if (type === INSTANCES_SEARCH_FAIL) {
      newStoreStateSlice.status = storeState.resultInstances ? READY : UNINITIALIZED;

    // ███████████████████████████████████████████████████████████████████████████████████████████████████████

    } else if (type === FORM_FILTER_RESET) {
      newStoreStateSlice.formFilter = buildDefaultFormFilter();

    // ███████████████████████████████████████████████████████████████████████████████████████████████████████

    } else if (type === FORM_FILTER_UPDATE) {
      const {
        name: fieldName,
        value: fieldValue
      } = payload;

      newStoreStateSlice.formFilter = {
        [fieldName]: fieldValue || fieldValue === 0 || fieldValue === false ? fieldValue : EMPTY_FILTER_VALUE
      };

    // ███████████████████████████████████████████████████████████████████████████████████████████████████████

    } else if (type === ALL_INSTANCES_SELECT) {
      newStoreStateSlice.selectedInstances = storeState.resultInstances;

    // ███████████████████████████████████████████████████████████████████████████████████████████████████████

    } else if (type === ALL_INSTANCES_DESELECT) {
      newStoreStateSlice.selectedInstances = [];

    // ███████████████████████████████████████████████████████████████████████████████████████████████████████

    } else if (type === INSTANCE_SELECT) {
      let { instance } = payload;
      newStoreStateSlice.selectedInstances = storeState.selectedInstances.concat([instance]);

    // ███████████████████████████████████████████████████████████████████████████████████████████████████████

    } else if (type === INSTANCE_DESELECT) {
      let { instance } = payload;
      newStoreStateSlice.selectedInstances = storeState.selectedInstances.filter(ins => ins !== instance);

    // ███████████████████████████████████████████████████████████████████████████████████████████████████████
    }

    return u(newStoreStateSlice, storeState);  // returned object is frozen for NODE_ENV === 'development'
  };
};
