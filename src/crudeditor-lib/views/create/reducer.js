import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import u from 'updeep';

import {
  INSTANCE_CREATE,

  INSTANCE_SAVE,
  INSTANCE_SAVE_REQUEST,
  INSTANCE_SAVE_SUCCESS,
  INSTANCE_SAVE_FAIL,

  READY,
  SAVING
} from './constants';

const defaultStoreStateTemplate = {
  instance: {},
  status: READY
};

/*
 * XXX:
 * Only objects and arrays are allowed at branch nodes.
 * Only primitive data types are allowed at leaf nodes.
 */
export default modelDefinition => (
  storeState = cloneDeep(defaultStoreStateTemplate),
  { type, payload, error, meta }
) => {
  const newStoreStateSlice = {};

  // ███████████████████████████████████████████████████████████████████████████████████████████████████████████

  if (type === INSTANCE_CREATE) {
    const { instance } = payload;
    newStoreStateSlice.instance = u.constant(instance);

    // ███████████████████████████████████████████████████████████████████████████████████████████████████████

  } else if (type === INSTANCE_SAVE_REQUEST) {
    newStoreStateSlice.status = SAVING;

  // ███████████████████████████████████████████████████████████████████████████████████████████████████████

  } else if (type === INSTANCE_SAVE_SUCCESS) {
    newStoreStateSlice.status = READY;

  // ███████████████████████████████████████████████████████████████████████████████████████████████████████

  } else if (type === INSTANCE_SAVE_FAIL) {
    newStoreStateSlice.status = READY;

  // ███████████████████████████████████████████████████████████████████████████████████████████████████████████
  }

  return u(newStoreStateSlice, storeState);  // returned object is frozen for NODE_ENV === 'development'
};
