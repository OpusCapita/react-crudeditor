import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import u from 'updeep';

import {
  format as formatField,
  parse as parseField,
  validate as validateField
} from '../../../data-types-lib';

import {
  INSTANCE_EDIT_REQUEST,
  INSTANCE_EDIT_SUCCESS,
  INSTANCE_EDIT_FAIL,

  INSTANCE_FIELD_CHANGE,
  INSTANCE_FIELD_VALIDATE,

  INSTANCE_SAVE_FAIL,
  INSTANCE_SAVE_REQUEST,
  INSTANCE_SAVE_SUCCESS,

  INSTANCE_VALIDATE_FAIL,
  INSTANCE_VALIDATE_SUCCESS,

  TAB_SELECT,

  VIEW_INITIALIZE_REQUEST,
  VIEW_INITIALIZE_FAIL,
  VIEW_INITIALIZE_SUCCESS,

  VIEW_REDIRECT_REQUEST,
  VIEW_REDIRECT_FAIL,
  VIEW_REDIRECT_SUCCESS
} from './constants';

import {
  STATUS_EXTRACTING,
  STATUS_DELETING,
  STATUS_INITIALIZING,
  STATUS_READY,
  STATUS_REDIRECTING,
  STATUS_UNINITIALIZED,
  STATUS_UPDATING,

  INSTANCES_DELETE_FAIL,
  INSTANCES_DELETE_REQUEST,

  UNPARSABLE_FIELD_VALUE
} from '../../common/constants';

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

  status: STATUS_UNINITIALIZED
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
  if (storeState.status === STATUS_UNINITIALIZED && type !== VIEW_INITIALIZE_REQUEST) {
    return storeState;
  }

  let newStoreStateSlice = {};

  // ███████████████████████████████████████████████████████████████████████████████████████████████████████████

  if (type === VIEW_INITIALIZE_REQUEST) {
    newStoreStateSlice.status = STATUS_INITIALIZING;
  } else if (type === VIEW_INITIALIZE_FAIL) {
    newStoreStateSlice.status = STATUS_UNINITIALIZED;
  } else if (type === VIEW_INITIALIZE_SUCCESS) {
    newStoreStateSlice.status = STATUS_READY;

  // ███████████████████████████████████████████████████████████████████████████████████████████████████████████
  } else if (type === VIEW_REDIRECT_REQUEST) {
    newStoreStateSlice.status = STATUS_REDIRECTING;
  } else if (type === VIEW_REDIRECT_FAIL) {
    const errors = Array.isArray(payload) ? payload : [payload];

    if (!isEqual(storeState.errors.general, errors)) {
      newStoreStateSlice.errors = {
        general: errors
      };
    }

    newStoreStateSlice.status = STATUS_READY;
  } else if (type === VIEW_REDIRECT_SUCCESS) {
    // Reseting the store to initial uninitialized state.
    newStoreStateSlice = u.constant(cloneDeep(defaultStoreStateTemplate));

  // ███████████████████████████████████████████████████████████████████████████████████████████████████████████
  } else if (type === INSTANCES_DELETE_REQUEST) {
    newStoreStateSlice.status = STATUS_DELETING;
  } else if (type === INSTANCES_DELETE_FAIL) {
    const errors = Array.isArray(payload) ? payload : [payload];

    if (!isEqual(storeState.errors.general, errors)) {
      newStoreStateSlice.errors = {
        general: errors
      };
    }

    newStoreStateSlice.status = STATUS_READY;

  // ███████████████████████████████████████████████████████████████████████████████████████████████████████
  } else if (type === INSTANCE_EDIT_REQUEST && storeState.status !== STATUS_INITIALIZING) {
    newStoreStateSlice.status = STATUS_EXTRACTING;
  } else if (type === INSTANCE_SAVE_REQUEST) {
    newStoreStateSlice.status = STATUS_UPDATING;

  // ███████████████████████████████████████████████████████████████████████████████████████████████████████████
  } else if (~[INSTANCE_EDIT_SUCCESS, INSTANCE_SAVE_SUCCESS].indexOf(type)) {
    const { instance } = payload;

    const formLayout = modelDefinition.ui.edit.formLayout(instance).
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
    newStoreStateSlice.activeTab = u.constant(formLayout.filter(({ tab }) => !!tab)[0]);
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

    if (storeState.status !== STATUS_INITIALIZING) {
      newStoreStateSlice.status = STATUS_READY;
    }

  // ███████████████████████████████████████████████████████████████████████████████████████████████████████
  } else if (~[INSTANCE_EDIT_FAIL, INSTANCE_SAVE_FAIL].indexOf(type) && storeState.status !== STATUS_INITIALIZING) {
    const errors = Array.isArray(payload) ? payload : [payload];

    if (!isEqual(storeState.errors.general, errors)) {
      newStoreStateSlice.errors = {
        general: errors
      };
    }

    newStoreStateSlice.status = STATUS_READY;

  // ███████████████████████████████████████████████████████████████████████████████████████████████████████
  } else if (type === INSTANCE_FIELD_CHANGE) {
    const {
      name: fieldName,
      value: fieldValue
    } = payload;

    newStoreStateSlice.formatedInstance = {
      [fieldName]: u.constant(fieldValue)
    };

    newStoreStateSlice.divergedField = fieldName;

  // ███████████████████████████████████████████████████████████████████████████████████████████████████████
  } else if (type === INSTANCE_FIELD_VALIDATE && storeState.divergedField) {
    // if storeState.divergedField is null, no data has changed.
    const { name: fieldName } = payload;
    const fieldMeta = modelDefinition.model.fields[fieldName];
    const uiType = findFieldLayout(fieldName)(storeState.formLayout).render.valueProp.type;

    try {
      const newFormValue = parseField({
        value: storeState.formatedInstance[fieldName],
        type: fieldMeta.type,
        sourceType: uiType
      });

      if (!isEqual(newFormValue, storeState.formInstance[fieldName])) {
        newStoreStateSlice.formInstance = {
          [fieldName]: u.constant(newFormValue)
        };
      }

      const newFormatedValue = formatField({
        value: newFormValue,
        type: fieldMeta.type,
        targetType: uiType
      });

      if (!isEqual(newFormatedValue, storeState.formatedInstance[fieldName])) {
        newStoreStateSlice.formatedInstance = {
          [fieldName]: u.constant(newFormatedValue)
        };
      }

      try {
        validateField({
          value: newFormValue,
          type: fieldMeta.type,
          constraints: fieldMeta.constraints
        });

        if (storeState.errors.fields[fieldName].length) {
          newStoreStateSlice.errors = {
            fields: {
              [fieldName]: []
            }
          };
        }
      } catch (err) {
        const errors = Array.isArray(err) ? err : [err];

        if (!isEqual(errors, storeState.errors.fields[fieldName])) {
          newStoreStateSlice.errors = {
            fields: {
              [fieldName]: errors
            }
          };
        }
      }
    } catch (err) {
      const errors = Array.isArray(err) ? err : [err];

      newStoreStateSlice.formInstance = {
        [fieldName]: UNPARSABLE_FIELD_VALUE
      };

      if (!isEqual(errors, storeState.errors.fields[fieldName])) {
        newStoreStateSlice.errors = {
          fields: {
            [fieldName]: errors
          }
        };
      }
    }

    newStoreStateSlice.divergedField = null;

  // ███████████████████████████████████████████████████████████████████████████████████████████████████████
  } else if (type === INSTANCE_VALIDATE_SUCCESS) {
    if (storeState.errors.general.length) {
      newStoreStateSlice.errors = {
        general: []
      };
    }

  // ███████████████████████████████████████████████████████████████████████████████████████████████████████
  } else if (type === INSTANCE_VALIDATE_FAIL) {
    const errors = Array.isArray(payload) ? payload : [payload];

    if (!isEqual(storeState.errors.general, errors)) {
      newStoreStateSlice.errors = {
        general: errors
      };
    }

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
