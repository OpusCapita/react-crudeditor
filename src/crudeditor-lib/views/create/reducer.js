import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import u from 'updeep';

import { checkFormLayout } from '../../check-model';

import {
  ALL_INSTANCE_FIELDS_VALIDATE,

  INSTANCE_FIELD_CHANGE,
  INSTANCE_FIELD_VALIDATE,

  INSTANCE_SAVE_FAIL,
  INSTANCE_SAVE_REQUEST,
  INSTANCE_SAVE_SUCCESS,

  VIEW_INITIALIZE,

  VIEW_REDIRECT_REQUEST,
  VIEW_REDIRECT_SUCCESS,
  VIEW_REDIRECT_FAIL,

  TAB_SELECT
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

const defaultStoreStateTemplate = {

  // predefinedFields: <object, an entity instance with predefined field values>

  predefinedFields: {},

  /* Parsed instance as displayed in the form.
   * {
   *   <string, field name>: <serializable, field value for communication with the server>,
   * }
   */
  formInstance: undefined,

  /* Formatted instance as displayed in the form.
   * {
   *   <sting, field name>: <any, field value for cummunication with rendering React Component>,
   * }
   * NOTE: formInstance values and formattedInstance values represent different values in case of parsing error
   * (i.e. rendered value cannot be parsed into its string representation).
   */
  formattedInstance: undefined,

  // Must always be an array, may be empty.
  formLayout: [],

  // A ref to one of tabs element => it is undefined when and only when formLayout does not consist of tabs.
  activeTab: undefined,

  instanceLabel: undefined,

  errors: {

    // object with keys as field names,
    // values as arrays of Parsing Errors and Field Validation Errors, may not be empty.
    // (the object does not have keys for fields with successfully parsed/validated values).
    fields: {}
  },

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

  if (type === VIEW_INITIALIZE) {
    const { predefinedFields } = payload;

    if (!isEqual(predefinedFields, storeState.predefinedFields)) {
      newStoreStateSlice.predefinedFields = u.constant(predefinedFields);
    }

    // create form instance using all existing fields
    // then rewrite predefined values coming from search view
    const formInstance = {
      ...Object.keys(modelDefinition.model.fields).reduce(
        (rez, fieldName) => ({
          ...rez,
          [fieldName]: EMPTY_FIELD_VALUE
        }),
        {}
      ),
      ...cloneDeep(predefinedFields)
    };

    newStoreStateSlice.formInstance = u.constant(formInstance);

    const formLayout = modelDefinition.ui.create.formLayout(formInstance).
      filter(entry => !!entry); // Removing empty tabs/sections and null tabs/sections/fields.

    checkFormLayout(formLayout);

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

    const formattedInstance = Object.keys(formInstance).reduce(
      (rez, fieldName) => {
        const fieldLayout = findFieldLayout(fieldName)(formLayout);

        return fieldLayout ? {
          ...rez,
          [fieldName]: fieldLayout.render.value.converter.format({ value: formInstance[fieldName], i18n })
        } : rez; // Field from the modelDefinition.model.fields is not in formLayout => it isn't displayed.
      },
      {}
    );

    newStoreStateSlice.formattedInstance = u.constant(formattedInstance);

    newStoreStateSlice.activeTab = u.constant(
      getTab(formLayout)
    );

    newStoreStateSlice.instanceLabel = modelDefinition.ui.instanceLabel(formInstance);

    newStoreStateSlice.errors = u.constant({
      fields: {}
    });

    newStoreStateSlice.status = STATUS_READY;

  // ███████████████████████████████████████████████████████████████████████████████████████████████████████████

  } else if (type === VIEW_REDIRECT_REQUEST) {
    newStoreStateSlice.status = STATUS_REDIRECTING;

  } else if (type === INSTANCE_SAVE_SUCCESS) {
    newStoreStateSlice.status = STATUS_READY;

  } else if (type === VIEW_REDIRECT_FAIL) {
    newStoreStateSlice.status = STATUS_READY;

  } else if (type === VIEW_REDIRECT_SUCCESS) {
    // Reseting the store to initial uninitialized state.
    newStoreStateSlice = u.constant(cloneDeep(defaultStoreStateTemplate));

  // ███████████████████████████████████████████████████████████████████████████████████████████████████████

  } else if (type === INSTANCE_SAVE_REQUEST) {
    newStoreStateSlice.status = STATUS_CREATING;

  // ███████████████████████████████████████████████████████████████████████████████████████████████████████

  } else if (type === INSTANCE_SAVE_FAIL) {
    newStoreStateSlice.status = STATUS_READY;

  // ███████████████████████████████████████████████████████████████████████████████████████████████████████████

  } else if (type === TAB_SELECT) {
    const { tabName } = payload; // may be not specified (i.e. falsy).

    newStoreStateSlice.activeTab = u.constant(
      getTab(storeState.formLayout, tabName)
    );

  // ███████████████████████████████████████████████████████████████████████████████████████████████████████████

  } else if (type === INSTANCE_FIELD_CHANGE) {
    const {
      name: fieldName,
      value: fieldValue
    } = payload;

    const {
      validate,
      render: {
        value: {
          converter
        }
      }
    } = findFieldLayout(fieldName)(storeState.formLayout);

    PARSE_LABEL: {
      let newFormValue;

      try {
        newFormValue = converter.parse({ value: fieldValue, i18n });
      } catch (err) {
        if (err instanceof Error) {
          console.warn(err);
        }

        const errors = Array.isArray(err) ? err : [err];

        newStoreStateSlice.formInstance = {
          [fieldName]: UNPARSABLE_FIELD_VALUE
        };

        if (!isEqual(fieldValue, storeState.formattedInstance[fieldName])) {
          newStoreStateSlice.formattedInstance = {
            [fieldName]: u.constant(fieldValue)
          };
        }

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

      const newFormattedValue = converter.format({ value: newFormValue, i18n });

      if (!isEqual(newFormattedValue, storeState.formattedInstance[fieldName])) {
        newStoreStateSlice.formattedInstance = {
          [fieldName]: u.constant(newFormattedValue)
        };
      }

      try {
        validate(newFormValue, {
          ...storeState.formInstance,
          [fieldName]: newFormValue
        });
      } catch (err) {
        if (err instanceof Error) {
          console.warn(err);
        }

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

      if (storeState.errors.fields[fieldName]) {
        newStoreStateSlice.errors = {
          // u.omit() argument must be an array, since lodash v. 4.17.4 no longer supports a string.
          fields: u.omit([fieldName])
        };
      }
    }

  // ███████████████████████████████████████████████████████████████████████████████████████████████████████

  } else if (type === INSTANCE_FIELD_VALIDATE) {
    const fieldName = payload.name;
    const fieldValue = storeState.formInstance[fieldName];

    if (fieldValue !== UNPARSABLE_FIELD_VALUE) {
      PARSE_LABEL: {
        try {
          findFieldLayout(fieldName)(storeState.formLayout).validate(fieldValue, storeState.formInstance);
        } catch (err) {
          if (err instanceof Error) {
            console.warn(err);
          }

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

        if (storeState.errors.fields[fieldName]) {
          newStoreStateSlice.errors = {
            // u.omit() argument must be an array, since lodash v. 4.17.4 no longer supports a string.
            fields: u.omit([fieldName])
          };
        }
      }
    }

  // ███████████████████████████████████████████████████████████████████████████████████████████████████████████

  } else if (type === ALL_INSTANCE_FIELDS_VALIDATE) {
    Object.keys(modelDefinition.model.fields).forEach(fieldName => {
      const fieldValue = storeState.formInstance[fieldName];
      const fieldLayout = findFieldLayout(fieldName)(storeState.formLayout);

      if (
        // Field from the modelDefinition.model.fields is not in formLayout => it isn't displayed in Create View
        !fieldLayout ||

        // Field is read-only => no validation needed
        fieldLayout.readOnly ||

        fieldValue === UNPARSABLE_FIELD_VALUE
      ) {
        return;
      }

      try {
        fieldLayout.validate(fieldValue, storeState.formInstance);
      } catch (err) {
        if (err instanceof Error) {
          console.warn(err);
        }

        const errors = Array.isArray(err) ? err : [err];

        if (!isEqual(errors, storeState.errors.fields[fieldName])) {
          newStoreStateSlice.errors = {
            fields: {
              [fieldName]: errors
            }
          };
        }

        return;
      }

      if (storeState.errors.fields[fieldName]) {
        newStoreStateSlice.errors = {
          // u.omit() argument must be an array, since lodash v. 4.17.4 no longer supports a string.
          fields: u.omit([fieldName])
        };
      }
    });

  // ███████████████████████████████████████████████████████████████████████████████████████████████████████
  /* eslint-enable padded-blocks */
  }

  return u(newStoreStateSlice, storeState); // returned object is frozen for NODE_ENV === 'development'
};
