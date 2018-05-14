import cloneDeep from 'lodash/cloneDeep';
import u from 'updeep';

import {
  INSTANCE_SHOW_SUCCESS,
  INSTANCE_SHOW_REQUEST,

  VIEW_INITIALIZE_REQUEST,
  VIEW_INITIALIZE_FAIL,
  VIEW_INITIALIZE_SUCCESS,

  VIEW_REDIRECT_REQUEST,
  VIEW_REDIRECT_FAIL,
  VIEW_REDIRECT_SUCCESS,

  TAB_SELECT
} from './constants';

import {
  STATUS_INITIALIZING,
  STATUS_READY,
  STATUS_REDIRECTING,
  STATUS_SEARCHING,
  STATUS_UNINITIALIZED,
  STATUS_EXTRACTING
} from '../../common/constants';

import {
  INSTANCES_SEARCH_REQUEST,
  INSTANCES_SEARCH_FAIL,
  INSTANCES_SEARCH_SUCCESS
} from '../search/constants';

import { checkFormLayout } from '../../check-model';
import { findFieldLayout, getTab } from '../lib';

const defaultStoreStateTemplate = {

  // Instance as saved on server-side.
  persistentInstance: undefined,

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

  /* instance's absolute offset in search result (0 <= offset < totalCount),
   * or
   * undefined if absolute offset is unknown (in cases of hard redirect to Search View).
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

  // ███████████████████████████████████████████████████████████████████████████████████████████████████████

  } else if (type === INSTANCE_SHOW_REQUEST) {
    newStoreStateSlice.status = STATUS_EXTRACTING;

  } else if (type === INSTANCE_SHOW_SUCCESS) {
    const { instance, offset } = payload;
    newStoreStateSlice.offset = offset;

    const formLayout = modelDefinition.ui.show.formLayout(instance).
      filter(entry => !!entry); // Removing empty tabs/sections and null tabs/sections/fields.

    checkFormLayout(formLayout);

    let hasTabs;
    let hasSectionsOrFields;

    formLayout.forEach(entry => {
      hasTabs = hasTabs || entry.tab;
      hasSectionsOrFields = hasSectionsOrFields || entry.section || entry.field;

      if (hasTabs && hasSectionsOrFields) {
        throw new TypeError('formLayout must not have tabs together with sections/fields at top level');
      }
    });

    newStoreStateSlice.formLayout = u.constant(formLayout);

    newStoreStateSlice.activeTab = u.constant(
      getTab(formLayout, (storeState.activeTab || {}).tab)
    );

    newStoreStateSlice.persistentInstance = u.constant(instance);
    newStoreStateSlice.instanceLabel = modelDefinition.ui.instanceLabel(instance);

    newStoreStateSlice.formattedInstance = u.constant(Object.keys(instance).reduce(
      (rez, fieldName) => {
        const fieldLayout = findFieldLayout(fieldName)(formLayout);

        return fieldLayout ? {
          ...rez,
          [fieldName]: fieldLayout.render.value.converter.format({ value: instance[fieldName], i18n })
        } : rez; // Field from the modelDefinition.model.fields is not in formLayout => it isn't displayed in Edit View.
      },
      {}
    ));

    if (storeState.status !== STATUS_INITIALIZING) {
      newStoreStateSlice.status = STATUS_READY;
    }

  // ███████████████████████████████████████████████████████████████████████████████████████████████████████

  } else if (type === TAB_SELECT) {
    const { tabName } = payload; // may be not specified (i.e. falsy).

    newStoreStateSlice.activeTab = u.constant(
      getTab(storeState.formLayout, tabName)
    );

  // ███████████████████████████████████████████████████████████████████████████████████████████████████████████
  /* eslint-enable padded-blocks */
  }

  return u(newStoreStateSlice, storeState); // returned object is frozen for NODE_ENV === 'development'
};
