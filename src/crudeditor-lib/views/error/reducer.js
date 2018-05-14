import cloneDeep from 'lodash/cloneDeep';
import u from 'updeep';

import {
  STATUS_READY,
  STATUS_REDIRECTING,
  STATUS_UNINITIALIZED,

  ERROR_CODE_INTERNAL
} from '../../common/constants';

import {
  VIEW_INITIALIZE,
  VIEW_REDIRECT_REQUEST,
  VIEW_REDIRECT_FAIL,
  VIEW_REDIRECT_SUCCESS
} from './constants';

const defaultStoreStateTemplate = {

  /*
   * An array of errors, may be empty. Each error has the following structure:
   * {
   *   code: <natural number, error code>,
   *   ?payload: <any, structure is defined by error code>
   * }
   */
  errors: [],

  status: STATUS_UNINITIALIZED
};

/*
 * XXX:
 * Only objects and arrays are allowed at branch nodes.
 * Only primitive data types are allowed at leaf nodes.
 */

export default /* istanbul ignore next */ (modelDefinition, i18n) => (
  storeState = cloneDeep(defaultStoreStateTemplate),
  { type, payload, error, meta }
) => {
  if (storeState.status === STATUS_UNINITIALIZED && type !== VIEW_INITIALIZE) {
    return storeState;
  }

  let newStoreStateSlice = {};

  /* eslint-disable padded-blocks */
  // ███████████████████████████████████████████████████████████████████████████████████████████████████████████

  if ([VIEW_INITIALIZE, VIEW_REDIRECT_FAIL].indexOf(type) > -1) {
    const errors = Array.isArray(payload) ? payload : [payload];

    newStoreStateSlice.errors = errors.map(({ code, ...rest }) => ({
      code: code || ERROR_CODE_INTERNAL,
      ...(Object.keys(rest).length ? { payload: rest.payload || rest } : {})
    }));

    newStoreStateSlice.status = STATUS_READY;

  // ███████████████████████████████████████████████████████████████████████████████████████████████████████████

  } else if (type === VIEW_REDIRECT_REQUEST) {
    newStoreStateSlice.status = STATUS_REDIRECTING;

  // ███████████████████████████████████████████████████████████████████████████████████████████████████████████

  } else if (type === VIEW_REDIRECT_SUCCESS) {
    // Reseting the store to initial uninitialized state.
    newStoreStateSlice = u.constant(cloneDeep(defaultStoreStateTemplate));

  // ███████████████████████████████████████████████████████████████████████████████████████████████████████████
  /* eslint-enable padded-blocks */
  }

  return u(newStoreStateSlice, storeState); // returned object is frozen for NODE_ENV === 'development'
};
