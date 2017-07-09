import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import * as u from 'updeep';

import { constants as searchConstants } from '../search';

import {
  UNINITIALIZED,
  READY
} from './constants';

const { INSTANCES_SEARCH_FAIL } = searchConstants;

const defaultStoreStateTemplate = {
  code: undefined,
  payload: undefined,
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

  if (type === INSTANCES_SEARCH_FAIL) {
    const {
      code,
      payload: codePayload
    } = payload;

    newStoreStateSlice.code = code;
    newStoreStateSlice.payload = codePayload;
    newStoreStateSlice.status = READY;

  // ███████████████████████████████████████████████████████████████████████████████████████████████████████████
  }

  return u(newStoreStateSlice, storeState);  // returned object is frozen for NODE_ENV === 'development'
}
