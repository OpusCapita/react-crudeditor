import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import u from 'updeep';

import { INSTANCE_CREATE } from '../views/create/constants';
//import { INSTANCE_SHOW_SUCCESS } from '../views/show/constants';
//
import {
  INSTANCES_SEARCH_SUCCESS,
  INSTANCES_SEARCH_FAIL
} from '../views/search/constants';

import {
  INSTANCE_EDIT_SUCCESS,
  INSTANCE_EDIT_FAIL,
  EDIT_EXIT
} from '../views/edit/constants';

import {
  VIEW_SEARCH,
  VIEW_CREATE,
  VIEW_EDIT,
  VIEW_SHOW,
  VIEW_ERROR
} from './constants';

const defaultStoreStateTemplate = {
  activeViewName: undefined,  // XXX: must be undefined until initialization completes.
};

/*
 * XXX:
 * Only objects and arrays are allowed at branch nodes.
 * Only primitive data types are allowed at leaf nodes.
 */
export default modelMetaData => (
  storeState = cloneDeep(defaultStoreStateTemplate),
  { type, payload, error, meta }
) => {
  const newStoreStateSlice = {};

  // ███████████████████████████████████████████████████████████████████████████████████████████████████████

  if (type === INSTANCES_SEARCH_SUCCESS) {
    newStoreStateSlice.activeViewName = VIEW_SEARCH;

  // ███████████████████████████████████████████████████████████████████████████████████████████████████████

  } else if (type === INSTANCE_CREATE) {
    newStoreStateSlice.activeViewName = VIEW_CREATE;

  // ███████████████████████████████████████████████████████████████████████████████████████████████████████

  } else if (type === INSTANCE_EDIT_SUCCESS) {
    newStoreStateSlice.activeViewName = VIEW_EDIT;

  // ███████████████████████████████████████████████████████████████████████████████████████████████████████

  //} else if (type === INSTANCE_SHOW_SUCCESS) {
    //newStoreStateSlice.activeViewName = VIEW_SHOW;

  // ███████████████████████████████████████████████████████████████████████████████████████████████████████

  } else if (type === INSTANCES_SEARCH_FAIL) {
    newStoreStateSlice.activeViewName = VIEW_ERROR;

  // ███████████████████████████████████████████████████████████████████████████████████████████████████████

  } else if (type === INSTANCE_EDIT_FAIL) {
    newStoreStateSlice.activeViewName = VIEW_ERROR;

  // ███████████████████████████████████████████████████████████████████████████████████████████████████████

  } else if (type === EDIT_EXIT) {
    newStoreStateSlice.activeViewName = VIEW_SEARCH;

  // ███████████████████████████████████████████████████████████████████████████████████████████████████████
  }

  return u(newStoreStateSlice, storeState);  // returned object is frozen for NODE_ENV === 'development'
};
