import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import u from 'updeep';

import {
  buildFormLayout,
  buildObjectLabel
} from '../lib';

import {
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

  objectLabel: undefined,
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
    let formLayout;

    if (instance && !isEqual(instance, storeState.persistentInstance)) {
      const viewMeta = modelMetaData.ui &&
        modelMetaData.ui.createEditShow &&
        modelMetaData.ui.createEditShow(VIEW_NAME);

      formLayout = buildFormLayout({
        instance,
        viewName: VIEW_NAME,
        viewMeta,
        modelMeta: modelMetaData.model
      });

      newStoreStateSlice.formLayout = u.constant(formLayout);
      newStoreStateSlice.persistentInstance = u.constant(instance);
      newStoreStateSlice.formInstance = u.constant(cloneDeep(instance));

      newStoreStateSlice.objectLabel = buildObjectLabel({
        instance,
        uiMeta: modelMetaData.ui
      });
    }

    if (formLayout ||  // New instance has been received => new formLayout was built.
      storeState.activeTab && storeState.activeTab.tab !== activeTabName  // New tab has been selected.
    ) {
      const tabs = (formLayout || storeState.formLayout).filter(({ tab }) => tab);  // [] in case of no tabs.
      const activeTab = tabs.find(({ tab: name }) => name === activeTabName) || tabs[0];  // undefined in case of no tabs.
      newStoreStateSlice.activeTab = u.constant(activeTab);
    }

    newStoreStateSlice.status = READY;

    // ███████████████████████████████████████████████████████████████████████████████████████████████████████

    } else if (type === INSTANCE_EDIT_FAIL) {
      newStoreStateSlice.status = storeState.persistentInstance ? READY : UNINITIALIZED;

    // ███████████████████████████████████████████████████████████████████████████████████████████████████████

    } else if (type === INSTANCE_FIELD_CHANGE) {
      const { field, value } = payload;

      newStoreStateSlice.formInstance = {
        [field]: value || value === 0 || value === false ? value : null
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
