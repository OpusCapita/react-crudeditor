import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import u from 'updeep';

import {
  INITIALIZING,
  EXTRACTING,
  READY,
  REDIRECTING,
  UNINITIALIZED,

  INSTANCE_CREATE_REQUEST,
  INSTANCE_CREATE_SUCCESS,
  INSTANCE_CREATE_FAIL,

  INSTANCE_SAVE_FAIL,
  INSTANCE_SAVE_REQUEST,
  INSTANCE_SAVE_SUCCESS,

  VIEW_INITIALIZE_REQUEST,
  VIEW_INITIALIZE_FAIL,
  VIEW_INITIALIZE_SUCCESS,
  VIEW_REDIRECT_REQUEST,
  VIEW_REDIRECT_SUCCESS,
  VIEW_REDIRECT_FAIL
} from './constants';

import {
  STATUS_READY,
  STATUS_CREATING
} from '../../common/constants';

const defaultStoreStateTemplate = {
  instance: {},
  status: STATUS_READY
};

/*
 * XXX:
 * Only objects and arrays are allowed at branch nodes.
 * Only primitive data types are allowed at leaf nodes.
 */
export default modelDefinition => (
  // storeState = cloneDeep(defaultStoreStateTemplate),
  storeState = {
    formLayout: modelDefinition.ui.create.formLayout,
    ...defaultStoreStateTemplate
  },
  { type, payload, error, meta }
) => {
  if (storeState.status === UNINITIALIZED && type !== VIEW_INITIALIZE_REQUEST) {
    return storeState;
  }

  let newStoreStateSlice = {};

  // ███████████████████████████████████████████████████████████████████████████████████████████████████████████

  if (type === VIEW_INITIALIZE_REQUEST) {
    newStoreStateSlice.status = INITIALIZING;
  } else if (type === VIEW_INITIALIZE_FAIL) {
    newStoreStateSlice.status = UNINITIALIZED;
  } else if (type === VIEW_INITIALIZE_SUCCESS) {
    newStoreStateSlice.status = READY;

  // ███████████████████████████████████████████████████████████████████████████████████████████████████████████
  } else if (type === VIEW_REDIRECT_REQUEST) {
    newStoreStateSlice.status = REDIRECTING;
  } else if (type === VIEW_REDIRECT_FAIL) {
    const errors = Array.isArray(payload) ? payload : [payload];

    if (!isEqual(storeState.errors.general, errors)) {
      newStoreStateSlice.errors = {
        general: errors
      };
    }

    newStoreStateSlice.status = READY;
  } else if (type === VIEW_REDIRECT_SUCCESS) {
    // Reseting the store to initial uninitialized state.
    newStoreStateSlice = u.constant(cloneDeep(defaultStoreStateTemplate));

  // ███████████████████████████████████████████████████████████████████████████████████████████████████████
  } else if (type === INSTANCE_CREATE_REQUEST && storeState.status !== INITIALIZING) {
    newStoreStateSlice.status = EXTRACTING;
  } else if (type === INSTANCE_SAVE_REQUEST) {
    newStoreStateSlice.status = STATUS_CREATING;

  // ███████████████████████████████████████████████████████████████████████████████████████████████████████
  } else if (type === INSTANCE_SAVE_SUCCESS) {
    newStoreStateSlice.status = STATUS_READY;

  // ███████████████████████████████████████████████████████████████████████████████████████████████████████
  } else if (type === INSTANCE_SAVE_FAIL) {
    newStoreStateSlice.status = STATUS_READY;

  // ███████████████████████████████████████████████████████████████████████████████████████████████████████████
  }

  return u(newStoreStateSlice, storeState); // returned object is frozen for NODE_ENV === 'development'
};
