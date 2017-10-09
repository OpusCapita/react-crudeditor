import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import u from 'updeep';

import { INSTANCES_SEARCH_FAIL } from '../search/constants';
import { INSTANCE_EDIT_FAIL } from '../edit/constants';
import { ERROR_CODE_INTERNAL } from '../../common/constants';

import {
  READY,
  REDIRECTING,
  UNINITIALIZED,

  VIEW_INITIALIZE,
  VIEW_REDIRECT_REQUEST,
  VIEW_REDIRECT_FAIL,
  VIEW_REDIRECT_SUCCESS
} from './constants';

const defaultStoreStateTemplate = {
  errors: undefined,
  status: UNINITIALIZED
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
  if (storeState.status === UNINITIALIZED && type !== VIEW_INITIALIZE) {
    return storeState;
  }

  let newStoreStateSlice = {};

  // ███████████████████████████████████████████████████████████████████████████████████████████████████████████

  if (~[VIEW_INITIALIZE, VIEW_REDIRECT_FAIL].indexOf(type)) {
    const errors = Array.isArray(payload) ? payload: [payload];

    newStoreStateSlice.errors = u.constant(errors.map(({ code, ...rest }) => ({
      code: code || ERROR_CODE_INTERNAL,
      ...(Object.keys(rest).length ? { payload: rest.payload  || rest } : {})
    })));

    newStoreStateSlice.status = READY;

  // ███████████████████████████████████████████████████████████████████████████████████████████████████████████

  } else if (type === VIEW_REDIRECT_REQUEST) {
    newStoreStateSlice.status = REDIRECTING;

  // ███████████████████████████████████████████████████████████████████████████████████████████████████████████

  } else if (type === VIEW_REDIRECT_SUCCESS) {
    // Reseting the store to initial uninitialized state.
    newStoreStateSlice = u.constant(cloneDeep(defaultStoreStateTemplate));

  // ███████████████████████████████████████████████████████████████████████████████████████████████████████████
  }

  return u(newStoreStateSlice, storeState);  // returned object is frozen for NODE_ENV === 'development'
};
