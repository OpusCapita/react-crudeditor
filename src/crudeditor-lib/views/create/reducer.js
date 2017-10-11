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
  STATUS_UNINITIALIZED,
  EMPTY_FIELD_VALUE
} from '../../common/constants';

import { findFieldLayout } from '../lib';

import {
  format as formatField,
  // parse as parseField,
  // validate as validateField
} from '../../../data-types-lib';

const defaultStoreStateTemplate = {

  // instance: <object, an entity instance with predefined field values>

  instance: {},

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
  } else if (type === INSTANCE_CREATE_SUCCESS) {
    // instance arrived here, holy js
    const { instance } = payload;

    newStoreStateSlice.status = READY;

    // newStoreStateSlice.instance = u.constant(instance);

    // edit copypaste
    const formLayout = modelDefinition.ui.create.formLayout(instance).
      filter(entry => !!entry); // Removing empty tabs/sections and null tabs/sections/fields.

    let hasTabs;
    let hasSectionsOrFields;

    formLayout.forEach(entry => {
      hasTabs = hasTabs || entry.tab;
      hasSectionsOrFields = hasSectionsOrFields || entry.section || entry.field;

      if (hasTabs && hasSectionsOrFields) {
        throw new Error('formLayout must not have tabs together with sections/fields at top level');
      }
    });

    newStoreStateSlice.formLayout = u.constant(formLayout);

    const defaultInstance = {
      ...Object.keys(modelDefinition.model.fields).
        reduce((obj, field) => ({ ...obj, [field]: EMPTY_FIELD_VALUE }), {}),
      ...instance
    };

    const formatedInstance = Object.keys(defaultInstance).reduce(
      (rez, fieldName) => {
        const fieldLayout = findFieldLayout(fieldName)(formLayout);
        return fieldLayout ? {
          ...rez,
          [fieldName]: formatField({
            value: defaultInstance[fieldName],
            type: modelDefinition.model.fields[fieldName].type,
            targetType: fieldLayout.render.valueProp.type
          })
        } : rez; // Field from the modelDefinition.model.fields is not in formLayout => it isn't displayed in Edit View.
      },
      {}
    );

    console.log("formatedInstance >>>>>>>>>" + JSON.stringify(formatedInstance, null, 2) + "<<<<<<<< formatedInstance")

    newStoreStateSlice.formatedInstance = u.constant(formatedInstance);

    newStoreStateSlice.activeTab = u.constant(formLayout.filter(({ tab }) => !!tab)[0]);
    newStoreStateSlice.formInstance = u.constant(cloneDeep(instance));
    newStoreStateSlice.instanceLabel = modelDefinition.ui.instanceLabel(instance);

    newStoreStateSlice.errors = u.constant({
      general: [],
      fields: Object.keys(instance).reduce(
        (rez, fieldName) => ({
          ...rez,
          [fieldName]: []
        }),
        {}
      )
    });

    if (storeState.status !== INITIALIZING) {
      newStoreStateSlice.status = STATUS_READY;
    }
    // -- edit copypaste
    //
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
