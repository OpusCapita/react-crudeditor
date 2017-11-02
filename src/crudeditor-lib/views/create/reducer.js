import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import u from 'updeep';

import {
  ALL_INSTANCE_FIELDS_VALIDATE,

  INSTANCE_SAVE_FAIL,
  INSTANCE_SAVE_REQUEST,
  INSTANCE_SAVE_SUCCESS,

  VIEW_INITIALIZE,

  VIEW_REDIRECT_REQUEST,
  VIEW_REDIRECT_SUCCESS,
  VIEW_REDIRECT_FAIL,

  TAB_SELECT,

  INSTANCE_FIELD_VALIDATE,

  INSTANCE_VALIDATE_SUCCESS,
  INSTANCE_VALIDATE_FAIL,
  INSTANCE_FIELD_CHANGE
} from './constants';

import {
  STATUS_READY,
  STATUS_CREATING,
  STATUS_UNINITIALIZED,
  EMPTY_FIELD_VALUE,
  STATUS_REDIRECTING,
  UNPARSABLE_FIELD_VALUE
} from '../../common/constants';

import { findFieldLayout, getTab } from '../lib';

import {
  format as formatField,
  parse as parseField,
  validate as validateField
} from '../../../data-types-lib';

const defaultStoreStateTemplate = {

  // predefinedFields: <object, an entity instance with predefined field values>

  predefinedFields: {},

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

  divergedField: null,

  instanceLabel: undefined,

  errors: {

    // object with keys as field names,
    // values as arrays of Parsing Errors and Field Validation Errors, may be empty.
    // (the object has keys for all fields).
    fields: {},

    // FIXME: remove as unnecessary.
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
  if (storeState.status === STATUS_UNINITIALIZED && type !== VIEW_INITIALIZE) {
    return storeState;
  }

  let newStoreStateSlice = {};

  // ███████████████████████████████████████████████████████████████████████████████████████████████████████████

  if (type === VIEW_INITIALIZE) {
    const { predefinedFields } = payload;
    newStoreStateSlice.status = STATUS_READY;

    const formLayout = modelDefinition.ui.create.formLayout(predefinedFields).
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

    // create default instance using all existing fields
    // then rewrite predefined values coming from search view
    const defaultInstance = {
      ...Object.keys(modelDefinition.model.fields).reduce(
        (rez, fieldName) => ({
          ...rez,
          [fieldName]: EMPTY_FIELD_VALUE
        }),
        {}
      ),
      ...predefinedFields
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
        } : rez; // Field from the modelDefinition.model.fields is not in formLayout => it isn't displayed.
      },
      {}
    );

    newStoreStateSlice.formatedInstance = u.constant(formatedInstance);

    newStoreStateSlice.activeTab = u.constant(formLayout.filter(({ tab }) => !!tab)[0]);
    newStoreStateSlice.formInstance = u.constant(cloneDeep(defaultInstance));
    newStoreStateSlice.instanceLabel = modelDefinition.ui.instanceLabel(defaultInstance);

    newStoreStateSlice.errors = u.constant({
      general: [],
      fields: Object.keys(defaultInstance).reduce(
        (rez, fieldName) => ({
          ...rez,
          [fieldName]: []
        }),
        {}
      )
    });

    // ███████████████████████████████████████████████████████████████████████████████████████████████████████████
  } else if (type === VIEW_REDIRECT_REQUEST) {
    newStoreStateSlice.status = STATUS_REDIRECTING;
  } else if (type === INSTANCE_SAVE_SUCCESS) {
    newStoreStateSlice.status = STATUS_READY;
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

    // ███████████████████████████████████████████████████████████████████████████████████████████████████████
  } else if (type === INSTANCE_SAVE_REQUEST) {
    newStoreStateSlice.status = STATUS_CREATING;

    // ███████████████████████████████████████████████████████████████████████████████████████████████████████
  } else if (type === INSTANCE_SAVE_FAIL) {
    const errors = Array.isArray(payload) ? payload : [payload];

    if (!isEqual(storeState.errors.general, errors)) {
      newStoreStateSlice.errors = {
        general: errors
      };
    }

    newStoreStateSlice.status = STATUS_READY;

    // ███████████████████████████████████████████████████████████████████████████████████████████████████████████
  } else if (type === TAB_SELECT) {
    const { tabName } = payload; // may be not specified (i.e. falsy).
    const activeTab = getTab(storeState, tabName);
    newStoreStateSlice.activeTab = activeTab;

    // ███████████████████████████████████████████████████████████████████████████████████████████████████████████
  } else if (type === INSTANCE_FIELD_CHANGE) {
    const {
      name: fieldName,
      value: fieldValue
    } = payload;

    newStoreStateSlice.formatedInstance = {
      [fieldName]: u.constant(fieldValue)
    };

    newStoreStateSlice.divergedField = fieldName;

    // ███████████████████████████████████████████████████████████████████████████████████████████████████████████
  } else if (type === INSTANCE_FIELD_VALIDATE && storeState.divergedField) {
    // if storeState.divergedField is null, no data has changed.
    const { name: fieldName } = payload;
    const fieldMeta = modelDefinition.model.fields[fieldName];
    const uiType = findFieldLayout(fieldName)(storeState.formLayout).render.valueProp.type;

    PARSE_LABEL: {
      let newFormValue;

      try {
        newFormValue = parseField({
          value: storeState.formatedInstance[fieldName],
          type: fieldMeta.type,
          sourceType: uiType
        });
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

        break PARSE_LABEL;
      }

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
      } catch (err) {
        const errors = Array.isArray(err) ? err : [err];

        if (!isEqual(errors, storeState.errors.fields[fieldName])) {
          newStoreStateSlice.errors = {
            fields: {
              [fieldName]: errors
            }
          };
        }

        break PARSE_LABEL;
      }

      if (storeState.errors.fields[fieldName].length) {
        newStoreStateSlice.errors = {
          fields: {
            [fieldName]: []
          }
        };
      }
    }

    newStoreStateSlice.divergedField = null;

    // ███████████████████████████████████████████████████████████████████████████████████████████████████████████
  } else if (type === ALL_INSTANCE_FIELDS_VALIDATE) {
    Object.keys(modelDefinition.model.fields).forEach(fieldName => {
      const fieldLayout = findFieldLayout(fieldName)(storeState.formLayout);

      if (
        // Field from the modelDefinition.model.fields is not in formLayout => it isn't displayed in Edit View
        !fieldLayout ||

        // Field is read-only => no validation needed
        fieldLayout.readOnly ||

        // Field has been parsed/validated and errors found => skip duplicate validation.
        storeState.errors.fields[fieldName].length
      ) {
        return;
      }

      const fieldMeta = modelDefinition.model.fields[fieldName];

      try {
        validateField({
          value: storeState.formInstance[fieldName],
          type: fieldMeta.type,
          constraints: fieldMeta.constraints
        });
      } catch (err) {
        newStoreStateSlice.errors = {
          fields: {
            [fieldName]: Array.isArray(err) ? err : [err]
          }
        };
      }
    });

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
  }

  return u(newStoreStateSlice, storeState); // returned object is frozen for NODE_ENV === 'development'
};
