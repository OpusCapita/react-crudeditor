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
  INSTANCE_FIELD_VALIDATE,

  EXTRACTING,
  READY,
  UNINITIALIZED,

  VIEW_NAME,
  INSTANCE_FIELD_CHANGE,
  TAB_SELECT
} from './constants';

import { UNPARSABLE_FIELD_VALUE } from '../../common/constants';

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

  // Must always be an array, may be empty.
  formLayout: [],

  // A ref to one of tabs element => it is undefined when and only when formLayout does not consist of tabs.
  activeTab: undefined,

  instanceLabel: undefined,

  errors: {

    // object with keys as field names,
    // values as arrays of Parsing Errors and Field Validation Errors, may be empty.
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
  const newStoreStateSlice = {};

  // ███████████████████████████████████████████████████████████████████████████████████████████████████████████

  if (type === INSTANCE_EDIT_REQUEST) {
    newStoreStateSlice.status = EXTRACTING;

  // ███████████████████████████████████████████████████████████████████████████████████████████████████████████

  } else if (type === INSTANCE_EDIT_SUCCESS) {
    const { instance, activeTabName } = payload;
    let formLayout;

    if (instance && !isEqual(instance, storeState.persistentInstance)) {
      formLayout = modelDefinition.ui.edit.formLayout(instance).
        filter(entry => !!entry);  // Removing empty tabs/sections and null tabs/sections/fields.

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
          } : rez;  // Field from the modelDefinition.model.fields is not in formLayout => it isn't displayed  in Edit View.
        },
        {}
      ));
    }

    if (formLayout ||  // New instance has been received => new formLayout has been built.
      storeState.activeTab && storeState.activeTab.tab !== activeTabName  // New tab has been selected.
    ) {
      const tabs = (formLayout || storeState.formLayout).filter(({ tab }) => !!tab);  // [] in case of no tabs.
      const activeTab = tabs.find(({ tab: name }) => name === activeTabName) || tabs[0];  // undefined in case of no tabs.
      newStoreStateSlice.activeTab = u.constant(activeTab);
    }

    newStoreStateSlice.status = READY;

    // ███████████████████████████████████████████████████████████████████████████████████████████████████████

    } else if (type === INSTANCE_EDIT_FAIL) {
      newStoreStateSlice.status = storeState.persistentInstance ? READY : UNINITIALIZED;

    // ███████████████████████████████████████████████████████████████████████████████████████████████████████

    } else if (type === INSTANCE_FIELD_CHANGE) {
      const {
        name: fieldName,
        value: fieldValue
      } = payload;

      newStoreStateSlice.formatedInstance = {
        [fieldName]: u.constant(fieldValue)
      };

    // ███████████████████████████████████████████████████████████████████████████████████████████████████████

    } else if (type === INSTANCE_FIELD_VALIDATE) {
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
        } catch(errors) {
          if (!isEqual(errors, storeState.errors.fields[fieldName])) {
            newStoreStateSlice.errors = {
              fields: {
                [fieldName]: errors
              }
            };
          }
        }
      } catch(err) {
        newStoreStateSlice.formInstance = {
          [fieldName]: UNPARSABLE_FIELD_VALUE
        };

        if (!isEqual([err], storeState.errors.fields[fieldName])) {
          newStoreStateSlice.errors = {
            fields: {
              [fieldName]: [err]
            }
          };
        }
      }

    // ███████████████████████████████████████████████████████████████████████████████████████████████████████

    } else if (type === TAB_SELECT) {
      const { activeTabName } = payload;

      newStoreStateSlice.activeTab = u.constant(
        storeState.formLayout.find(({ tab: name }) => name === activeTabName)
      );

  // ███████████████████████████████████████████████████████████████████████████████████████████████████████████
  }

  return u(newStoreStateSlice, storeState);  // returned object is frozen for NODE_ENV === 'development'
};
