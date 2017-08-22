import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import u from 'updeep';

import { getLogicalKeyBuilder } from '../lib';

import {
  ALL_INSTANCES_SELECT,
  ALL_INSTANCES_DESELECT,

  EMPTY_FILTER_VALUE,

  FORM_FILTER_RESET,
  FORM_FILTER_UPDATE,

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

import {
  INSTANCES_DELETE_FAIL,
  INSTANCES_DELETE_REQUEST,
  INSTANCES_DELETE_SUCCESS,
} from '../../common/constants';

const buildDefaultStoreState = searchMeta => {
  const sortByDefaultIndex = searchMeta.resultFields.findIndex(({ sortByDefault }) => !!sortByDefault);

  const defaultStoreState = {
    resultFilter: {},  // Active filter as displayed in Search Result.
    formFilter: searchMeta.searchableFields.reduce(  // Raw filter as displayed in Search Criteria.
      (rez, { name }) => ({
        ...rez,
        [name]: EMPTY_FILTER_VALUE
      }),
      {}
    ),
    sortParams: {
      field: searchMeta.resultFields[sortByDefaultIndex === -1 ? 0 : sortByDefaultIndex].name,
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

  defaultStoreState.resultFilter = cloneDeep(defaultStoreState.formFilter);
  return defaultStoreState;
}

export { buildDefaultStoreState };

/*
 * XXX:
 * Only objects and arrays are allowed at branch nodes.
 * Only primitive data types are allowed at leaf nodes.
 */
export default modelDefinition => {
  const buildLogicalKey = getLogicalKeyBuilder(modelDefinition.model.fields);

  // Remove benchmarkInstances from sourceInstances by comparing their Logical Keys.
  const removeInstances = (sourceInstances, benchmarkInstances) =>
    sourceInstances.filter(sourceInstance =>
      !benchmarkInstances.find(benchmarkInstance =>
        isEqual(
          buildLogicalKey(sourceInstance),
          buildLogicalKey(benchmarkInstance)
        )
      )
    );

  return (storeState = buildDefaultStoreState(modelDefinition.ui.search), { type, payload, error, meta }) => {
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

      newStoreStateSlice.formFilter = u.constant(cloneDeep(filter));
      newStoreStateSlice.resultFilter = u.constant(cloneDeep(filter));
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

    } else if (type === INSTANCES_DELETE_REQUEST && storeState.status !== UNINITIALIZED) {
      newStoreStateSlice.status = DELETING;

    // ███████████████████████████████████████████████████████████████████████████████████████████████████████

    } else if (type === INSTANCES_DELETE_SUCCESS && storeState.status !== UNINITIALIZED) {
      const { instances } = payload;
      newStoreStateSlice.selectedInstances = removeInstances(storeState.selectedInstances, instances);
      newStoreStateSlice.resultInstances = removeInstances(storeState.resultInstances, instances);
      newStoreStateSlice.totalCount = storeState.totalCount - instances.length;
      newStoreStateSlice.status = READY;

    // ███████████████████████████████████████████████████████████████████████████████████████████████████████

    } else if (type === INSTANCES_DELETE_FAIL && storeState.status !== UNINITIALIZED) {
      newStoreStateSlice.status = READY;

    // ███████████████████████████████████████████████████████████████████████████████████████████████████████

    } else if (type === INSTANCES_SEARCH_FAIL) {
      newStoreStateSlice.status = storeState.resultInstances ? READY : UNINITIALIZED;

    // ███████████████████████████████████████████████████████████████████████████████████████████████████████

    } else if (type === FORM_FILTER_RESET) {
      newStoreStateSlice.formFilter = u.constant(buildDefaultStoreState(modelDefinition.ui.search).formFilter);

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
