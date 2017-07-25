import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import * as u from 'updeep';

import {
  buildFormLayout,
  buildInstanceDescription
} from '../../lib';

import {
  INSTANCE_EDIT,
  INSTANCE_EDIT_REQUEST,
  INSTANCE_EDIT_SUCCESS,
  INSTANCE_EDIT_FAIL,

  EXTRACTING,
  READY,
  UNINITIALIZED,

  VIEW_NAME,
  INSTANCE_FIELD_CHANGE,
  TAB_SELECT
} from './constants';

const defaultStoreStateTemplate = {
  persistentInstance: undefined,
  formInstance: undefined,

  // Must always be an array, may be empty.
  formLayout: [],

  // A ref to one of tabs element => it is undefined when and only when formLayout does not consist of tabs.
  activeTab: undefined,

  instanceDescription: undefined,
  errors: undefined,
  status: UNINITIALIZED
};

/*
 * XXX:
 * Only objects and arrays are allowed at branch nodes.
 * Only primitive data types are allowed at leaf nodes.
 */
export default modelMetaData => (
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

    const viewMeta = modelMetaData.ui &&
      modelMetaData.ui.createEditShow &&
      modelMetaData.ui.createEditShow(VIEW_NAME);

    const formLayout = buildFormLayout(instance, VIEW_NAME, { view: viewMeta, model: modelMetaData.model });
    const tabs = formLayout.filter(({ tab }) => tab);  // [] in case of no tabs.
    const activeTab = tabs.find(({ tab: name }) => name === activeTabName) || tabs[0];  // undefined in case of no tabs.

    newStoreStateSlice.formLayout = u.constant(formLayout);
    newStoreStateSlice.activeTab = u.constant(activeTab);
    newStoreStateSlice.persistentInstance = u.constant(instance);
    newStoreStateSlice.formInstance = u.constant(cloneDeep(instance));
    newStoreStateSlice.instanceDescription = buildInstanceDescription(instance, viewMeta);
    newStoreStateSlice.status = READY;

    // ███████████████████████████████████████████████████████████████████████████████████████████████████████

    } else if (type === INSTANCE_EDIT_FAIL) {
      newStoreStateSlice.status = storeState.resultInstances ? READY : UNINITIALIZED;

    // ███████████████████████████████████████████████████████████████████████████████████████████████████████

    } else if (type === INSTANCE_FIELD_CHANGE) {
      const { field, value } = payload;

      newStoreStateSlice.formInstance = {
        [field]: value
      };

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
