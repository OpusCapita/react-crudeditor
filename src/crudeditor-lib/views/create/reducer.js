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
  STATUS_CREATING,
  STATUS_UNINITIALIZED
} from '../../common/constants';

const defaultStoreStateTemplate = {

  // instance: <object, an entity instance with predefined field values>

  instance: {
    // todo...
  },

  /* Parsed instance as displayed in the form.
   * {
   *   <string, field name>: <serializable, field value for communication with the server>,
   * }
   */
  formInstance: undefined,

  /* Formated instance as displayed in the form.
   * {
   *   <sting, field name>: <any, field value for cummunication with rendering React Component>,
   * }
   * NOTE: formInstance values and formatedInstance values represent different values in case of parsing error
   * (i.e. rendered value cannot be parsed into its string representation).
   */
  formatedInstance: undefined,

  // Must always be an array, may be empty.
  formLayout: [],

  // A ref to one of tabs element => it is undefined when and only when formLayout does not consist of tabs.
  activeTab: undefined,

  instanceLabel: undefined,

  errors: {

    // object with keys as field names,
    // values as arrays of Parsing Errors and Field Validation Errors, may be empty.
    // (the object has keys for all fields).
    fields: {},

    // Array of Internal Errors and Instance Validation Errors, may be empty.
    general: []
  },

  status: STATUS_UNINITIALIZED
};


/*
 * XXX:
 * Only objects and arrays are allowed at branch nodes.
 * Only primitive data types are allowed at leaf nodes.
 */
export default modelDefinition => (
  storeState = {
    ...defaultStoreStateTemplate,
  },
  { type, payload, error, meta }
) => {
  if (storeState.status === UNINITIALIZED && type !== VIEW_INITIALIZE_REQUEST) {
    return storeState;
  }

  let newStoreStateSlice = {};

  // newStoreStateSlice.formLayout = modelDefinition.ui.create.formLayout({});
  // newStoreStateSlice.instance = modelDefinition.ui.create.defaultNewInstance(modelDefinition);

  // console.log("TYPES\n" + typeof modelDefinition.ui +
  // " " + typeof modelDefinition.ui.create +
  // " " + typeof modelDefinition.ui.create.formLayout);

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
    newStoreStateSlice.status = EXTRACTING; // TODO maybe remove this line
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
