import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import * as u from 'updeep';

import {
  INSTANCE_EDIT,
  INSTANCE_EDIT_REQUEST,
  INSTANCE_EDIT_SUCCESS,
  INSTANCE_EDIT_FAIL,

  EXTRACTING,
  READY,
  UNINITIALIZED
} from './constants';

const defaultStoreStateTemplate = {
  persistentInstance: undefined,
  formInstance: undefined,
  tab: 0,  // TODO: implement tab names
  status: UNINITIALIZED
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

  // ███████████████████████████████████████████████████████████████████████████████████████████████████████████

  if (type === INSTANCE_EDIT_REQUEST) {
    newStoreStateSlice.status = EXTRACTING;

  // ███████████████████████████████████████████████████████████████████████████████████████████████████████

  } else if (type === INSTANCE_EDIT_SUCCESS) {
    const { instance, tab } = payload;
    newStoreStateSlice.persistentInstance = instance;
    newStoreStateSlice.status = READY;

    // ███████████████████████████████████████████████████████████████████████████████████████████████████████

    } else if (type === INSTANCE_EDIT_FAIL) {
      newStoreStateSlice.status = storeState.resultInstances ? READY : UNINITIALIZED;

  // ███████████████████████████████████████████████████████████████████████████████████████████████████████████
  }

  return u(newStoreStateSlice, storeState);  // returned object is frozen for NODE_ENV === 'development'
};
