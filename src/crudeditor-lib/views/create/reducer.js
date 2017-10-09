import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import u from 'updeep';

import {
  format as formatField,
} from '../../../data-types-lib';

import {
  INITIALIZING,
  EXTRACTING,
  READY,
  REDIRECTING,
  UNINITIALIZED,
  UPDATING,

  INSTANCE_CREATE_REQUEST,
  INSTANCE_CREATE_SUCCESS,
  INSTANCE_CREATE_FAIL,

  INSTANCE_SAVE_FAIL,
  INSTANCE_SAVE_REQUEST,
  INSTANCE_SAVE_SUCCESS,

  TAB_SELECT,

  VIEW_INITIALIZE_REQUEST,
  VIEW_INITIALIZE_FAIL,
  VIEW_INITIALIZE_SUCCESS,

  VIEW_REDIRECT_REQUEST,
  VIEW_REDIRECT_FAIL,
  VIEW_REDIRECT_SUCCESS
} from './constants';

const findFieldLayout = fieldName => {
  const layoutWalker = layout => {
    if (layout.field === fieldName) {
      return layout;
    }

    let foundFieldLayout;

    return Array.isArray(layout) &&
      layout.some(entry => {
        foundFieldLayout = layoutWalker(entry);
        return foundFieldLayout;
      }) &&
      foundFieldLayout;
  };

  return layoutWalker;
}

const defaultStoreStateTemplate = {

  // Instance as saved on server-side.
  persistentInstance: undefined,

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

  // Field name a user is entering =>
  // formatedFilter[fieldName] is up-to-date, but
  // formFilter[fieldName] is obsolete and waits for been filled with parsed formatedFilter[fieldName]
  // (or UNPARSABLE_FIELD_VALUE if the value happens to be unparsable).
  divergedField: null,

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
    newStoreStateSlice.status = UPDATING;

  // ███████████████████████████████████████████████████████████████████████████████████████████████████████████
  } else if (~[INSTANCE_CREATE_SUCCESS, INSTANCE_SAVE_SUCCESS].indexOf(type)) {
    const { instance } = payload;

    const formLayout = modelDefinition.ui.create.formLayout(instance).
      filter(entry => !!entry); // Removing empty tabs/sections and null tabs/sections/fields.

    console.log("000000000000 create/reducer/formLayout\n" + JSON.stringify(formLayout, null, 2) + "\n00000000")

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
    newStoreStateSlice.persistentInstance = u.constant(instance);
    newStoreStateSlice.formInstance = u.constant(cloneDeep(instance));
    newStoreStateSlice.divergedField = null;
    newStoreStateSlice.instanceLabel = modelDefinition.ui.instanceLabel(instance);

    newStoreStateSlice.formatedInstance = u.constant(Object.keys(instance).reduce(
      (rez, fieldName) => {
        const fieldLayout = findFieldLayout(fieldName)(formLayout);
        return fieldLayout ? {
          ...rez,
          [fieldName]: formatField({
            value: instance[fieldName],
            type: modelDefinition.model.fields[fieldName].type,
            targetType: fieldLayout.render.valueProp.type
          })
        } : rez; // Field from the modelDefinition.model.fields is not in formLayout => it isn't displayed in Edit View.
      },
      {}
    ));

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
      newStoreStateSlice.status = READY;
    }

  // ███████████████████████████████████████████████████████████████████████████████████████████████████████
  } else if (~[INSTANCE_CREATE_FAIL, INSTANCE_SAVE_FAIL].indexOf(type) && storeState.status !== INITIALIZING) {
    const errors = Array.isArray(payload) ? payload : [payload];

    if (!isEqual(storeState.errors.general, errors)) {
      newStoreStateSlice.errors = {
        general: errors
      };
    }

    newStoreStateSlice.status = READY;

  // ███████████████████████████████████████████████████████████████████████████████████████████████████████
  } else if (type === TAB_SELECT) {
    const { tabName } = payload; // may be undefined.
    const tabs = storeState.formLayout.filter(({ tab }) => !!tab); // [] in case of no tabs.
    let activeTab = tabs[0]; // default tab, undefined in case of no tabs.

    if (tabName) {
      storeState.formLayout.some(tab => {
        if (tab.tab === tabName) {
          activeTab = tab;
          return true;
        }

        return false;
      });
    }

    newStoreStateSlice.activeTab = u.constant(activeTab);

  // ███████████████████████████████████████████████████████████████████████████████████████████████████████████
  }

  return u(newStoreStateSlice, storeState); // returned object is frozen for NODE_ENV === 'development'
};
