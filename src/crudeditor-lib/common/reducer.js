import cloneDeep from 'lodash/cloneDeep';
import u from 'updeep';

import { ACTIVE_VIEW_CHANGE } from './constants';

const defaultStoreStateTemplate = {
  activeViewName: null, // XXX: must be null until initialization completes.
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

  if (type === ACTIVE_VIEW_CHANGE) {
    newStoreStateSlice.activeViewName = payload.viewName;

  // ███████████████████████████████████████████████████████████████████████████████████████████████████████
  }

  return u(newStoreStateSlice, storeState); // returned object is frozen for NODE_ENV === 'development'
};
