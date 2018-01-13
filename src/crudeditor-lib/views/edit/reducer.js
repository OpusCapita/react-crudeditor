import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import u from 'updeep';

import { findFieldLayout, getTab } from '../lib';
import { FIELD_TYPE_BOOLEAN } from '../../../data-types-lib/constants';
import { checkFormLayout } from '../../check-model';

import {
  ALL_INSTANCE_FIELDS_VALIDATE,

  INSTANCE_EDIT_REQUEST,
  INSTANCE_EDIT_SUCCESS,
  INSTANCE_EDIT_FAIL,

  INSTANCE_FIELD_CHANGE,
  INSTANCE_FIELD_VALIDATE,

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

import {
  STATUS_EXTRACTING,
  STATUS_DELETING,
  STATUS_INITIALIZING,
  STATUS_READY,
  STATUS_REDIRECTING,
  STATUS_SEARCHING,
  STATUS_UNINITIALIZED,
  STATUS_UPDATING,

  INSTANCES_DELETE_FAIL,
  INSTANCES_DELETE_REQUEST,

  UNPARSABLE_FIELD_VALUE
} from '../../common/constants';

import {
  INSTANCES_SEARCH_REQUEST,
  INSTANCES_SEARCH_FAIL,
  INSTANCES_SEARCH_SUCCESS
} from '../search/constants';

// Synchronize formInstance and formattedInstance with instance (which is a persistentInstance).
const synchronizeInstances = /* istanbul ignore next */ ({ instance, formLayout, i18n }) => ({
  formInstance: u.constant(cloneDeep(instance)),

  formattedInstance: u.constant(Object.keys(instance).reduce(
    (rez, fieldName) => {
      const fieldLayout = findFieldLayout(fieldName)(formLayout);

      return fieldLayout ? {
        ...rez,
        [fieldName]: fieldLayout.render.value.converter.format({ value: instance[fieldName], i18n })
      } : rez; // Field from the modelDefinition.model.fields is not in formLayout => it isn't displayed in Edit View.
    },
    {}
  )),

  errors: u.constant({
    fields: {}
  })
});

const defaultStoreStateTemplate = {

  // Instance as saved on server-side.
  persistentInstance: undefined,

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
   * (i.e. rendered value cannot be parsed into its Field Type representation).
   */
  formattedInstance: undefined,

  // Must always be an array, may be empty.
  formLayout: [],

  // A ref to one of tabs element => it is undefined when and only when formLayout does not consist of tabs.
  activeTab: undefined,

  instanceLabel: undefined,

  errors: {

    /* object with keys as field names,
     * values as arrays of Parsing Errors and Field Validation Errors, may not be empty.
     * (the object does not have keys for fields with successfully parsed/validated values).
     */
    fields: {}
  },

  /* instance's absolute offset in search result (0 <= offset < totalCount),
   * or
   * undefined if absolute offset is unknown (in cases of hard redirect to Edit View or soft redirect from Create View).
   */
  offset: undefined,

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
  if (storeState.status === STATUS_UNINITIALIZED && type !== VIEW_INITIALIZE_REQUEST) {
    return storeState;
  }

  let newStoreStateSlice = {};

  /* eslint-disable padded-blocks */
  // ███████████████████████████████████████████████████████████████████████████████████████████████████████████

  if (type === VIEW_INITIALIZE_REQUEST) {
    newStoreStateSlice.status = STATUS_INITIALIZING;

  } else if (type === VIEW_INITIALIZE_FAIL) {
    newStoreStateSlice.status = STATUS_UNINITIALIZED;

  } else if (type === VIEW_INITIALIZE_SUCCESS) {
    newStoreStateSlice.status = STATUS_READY;

  // ███████████████████████████████████████████████████████████████████████████████████████████████████████████

  } else if (type === INSTANCES_SEARCH_REQUEST) {
    newStoreStateSlice.status = STATUS_SEARCHING;

  } else if ([INSTANCES_SEARCH_FAIL, INSTANCES_SEARCH_SUCCESS].indexOf(type) > -1) {
    newStoreStateSlice.status = STATUS_READY;

  // ███████████████████████████████████████████████████████████████████████████████████████████████████████████

  } else if (type === VIEW_REDIRECT_REQUEST) {
    newStoreStateSlice.status = STATUS_REDIRECTING;

  } else if (type === VIEW_REDIRECT_FAIL) {
    newStoreStateSlice.status = STATUS_READY;

  } else if (type === VIEW_REDIRECT_SUCCESS) {
    // Reseting the store to initial uninitialized state.
    newStoreStateSlice = u.constant(cloneDeep(defaultStoreStateTemplate));

  // ███████████████████████████████████████████████████████████████████████████████████████████████████████████

  } else if (type === INSTANCES_DELETE_REQUEST) {
    newStoreStateSlice.status = STATUS_DELETING;

  } else if (type === INSTANCES_DELETE_FAIL) {
    newStoreStateSlice.status = STATUS_READY;

  // ███████████████████████████████████████████████████████████████████████████████████████████████████████

  } else if (type === INSTANCE_EDIT_REQUEST && storeState.status !== STATUS_INITIALIZING) {
    newStoreStateSlice.status = STATUS_EXTRACTING;

  } else if (type === INSTANCE_SAVE_REQUEST) {
    newStoreStateSlice.status = STATUS_UPDATING;

  // ███████████████████████████████████████████████████████████████████████████████████████████████████████████

  } else if ([INSTANCE_EDIT_SUCCESS, INSTANCE_SAVE_SUCCESS].indexOf(type) > -1) {
    const { instance } = payload;

    if (type === INSTANCE_EDIT_SUCCESS) {
      newStoreStateSlice.offset = payload.offset;
    }

    const formLayout = modelDefinition.ui.edit.formLayout(instance).
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

    newStoreStateSlice.activeTab = u.constant(
      getTab(formLayout, (storeState.activeTab || {}).tab)
    );

    newStoreStateSlice.persistentInstance = u.constant(instance);
    newStoreStateSlice.instanceLabel = modelDefinition.ui.instanceLabel(instance);

    newStoreStateSlice = {
      ...newStoreStateSlice,
      ...synchronizeInstances({ instance, formLayout, i18n })
    };

    if (storeState.status !== STATUS_INITIALIZING) {
      newStoreStateSlice.status = STATUS_READY;
    }

  // ███████████████████████████████████████████████████████████████████████████████████████████████████████

  } else if ([INSTANCE_EDIT_FAIL, INSTANCE_SAVE_FAIL].indexOf(type) > -1 && storeState.status !== STATUS_INITIALIZING) {
    newStoreStateSlice.status = STATUS_READY;

  // ███████████████████████████████████████████████████████████████████████████████████████████████████████

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

      const persistentValue = storeState.persistentInstance[fieldName];

      if (modelDefinition.model.fields[fieldName].type === FIELD_TYPE_BOOLEAN && !persistentValue && !newFormValue) {
        newFormValue = persistentValue; // null and false are considered the same.
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
        // Field from the modelDefinition.model.fields is not in formLayout => it isn't displayed in Edit View
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

  } else if (type === TAB_SELECT) {
    const { tabName } = payload; // may be falsy, i.e. not specified.

    // reset to persistentInstance
    if (!isEqual(storeState.formInstance, storeState.persistentInstance)) {
      newStoreStateSlice = {
        ...newStoreStateSlice,
        ...synchronizeInstances({
          instance: storeState.persistentInstance,
          formLayout: storeState.formLayout,
          i18n
        })
      };
    }

    newStoreStateSlice.activeTab = u.constant(
      getTab(storeState.formLayout, tabName)
    );

  // ███████████████████████████████████████████████████████████████████████████████████████████████████████████
  /* eslint-enable padded-blocks */
  }

  return u(newStoreStateSlice, storeState); // returned object is frozen for NODE_ENV === 'development'
};
