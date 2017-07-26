import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import * as u from 'updeep';

import { setEntityConfiguration } from '../entityConfiguration';
import { constants as searchConstants } from '../views/search';
import { constants as createConstants } from '../views/create';
import { constants as editConstants   } from '../views/edit';
//import { constants as showConstants   } from '../views/show';

import {
  VIEW_SEARCH,
  VIEW_CREATE,
  VIEW_EDIT,
  VIEW_SHOW,
  VIEW_ERROR
} from './constants';

const {
  INSTANCES_SEARCH_SUCCESS,
  INSTANCES_SEARCH_FAIL
} = searchConstants;

const { INSTANCE_CREATE } = createConstants;

const {
  INSTANCE_EDIT_SUCCESS,
  INSTANCE_EDIT_FAIL,
  EDIT_EXIT
} = editConstants;

//const { INSTANCE_SHOW_SUCCESS } = showConstants;

const getDefaultStoreState = entityConfiguration => ({
  activeView: undefined,  // XXX: must be undefined until initialization completes.
  entityConfigurationIndex: setEntityConfiguration(entityConfiguration)
});

/*
 * XXX:
 * Only objects and arrays are allowed at branch nodes.
 * Only primitive data types are allowed at leaf nodes.
 */
export default entityConfiguration => {
  const defaultStoreState = getDefaultStoreState(entityConfiguration);

  return (storeState = defaultStoreState, { type, payload, error, meta }) => {
    const newStoreStateSlice = {};

    // ███████████████████████████████████████████████████████████████████████████████████████████████████████

    if (type === INSTANCES_SEARCH_SUCCESS) {
      newStoreStateSlice.activeView = VIEW_SEARCH;

    // ███████████████████████████████████████████████████████████████████████████████████████████████████████

    } else if (type === INSTANCE_CREATE) {
      newStoreStateSlice.activeView = VIEW_CREATE;

    // ███████████████████████████████████████████████████████████████████████████████████████████████████████

    } else if (type === INSTANCE_EDIT_SUCCESS) {
      newStoreStateSlice.activeView = VIEW_EDIT;

    // ███████████████████████████████████████████████████████████████████████████████████████████████████████

    //} else if (type === INSTANCE_SHOW_SUCCESS) {
      //newStoreStateSlice.activeView = VIEW_SHOW;

    // ███████████████████████████████████████████████████████████████████████████████████████████████████████

    } else if (type === INSTANCES_SEARCH_FAIL) {
      newStoreStateSlice.activeView = VIEW_ERROR;

    // ███████████████████████████████████████████████████████████████████████████████████████████████████████

    } else if (type === INSTANCE_EDIT_FAIL) {
      newStoreStateSlice.activeView = VIEW_ERROR;

    // ███████████████████████████████████████████████████████████████████████████████████████████████████████

    } else if (type === EDIT_EXIT) {
      newStoreStateSlice.activeView = VIEW_SEARCH;

    // ███████████████████████████████████████████████████████████████████████████████████████████████████████
    }

    return u(newStoreStateSlice, storeState);  // returned object is frozen for NODE_ENV === 'development'
  };
};
