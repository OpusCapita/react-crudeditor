import {
  EDIT_EXIT,
  INSTANCE_EDIT,
  INSTANCE_FIELD_VALIDATE,
  INSTANCE_FIELD_CHANGE,
  INSTANCE_SAVE,
  TAB_SELECT
} from './constants';

import {
  AFTER_ACTION_NEW,
  AFTER_ACTION_NEXT
} from '../../common/constants';

export const

  // █████████████████████████████████████████████████████████████████████████████████████████████████████████

  editInstance = ({
    instance,
    tab: activeTabName
  }, source) => ({
    type: INSTANCE_EDIT,
    payload: {
      instance,
      activeTabName
    },
    meta: {
      source
    }
  }),

  // █████████████████████████████████████████████████████████████████████████████████████████████████████████

  // TODO: implement reducer.
  changeInstanceField = ({
    name: fieldName,
    value: fieldNewValue
  }) => ({
    type: INSTANCE_FIELD_CHANGE,
    payload: {
      name: fieldName,
      value: fieldNewValue
    }
  }),

  // █████████████████████████████████████████████████████████████████████████████████████████████████████████

  // TODO: implement reducer.
  validateInstanceField = fieldName => ({
    type: INSTANCE_FIELD_VALIDATE,
    payload: {
      name: fieldName
    }
  }),

  // █████████████████████████████████████████████████████████████████████████████████████████████████████████

  // TODO: implement reducer.
  saveInstance = _ => ({
    type: INSTANCE_SAVE
  }),

  // █████████████████████████████████████████████████████████████████████████████████████████████████████████
  // █████████████████████████████████████████████████████████████████████████████████████████████████████████

  // TODO: implement reducer.
  saveAndNewInstance = _ => ({
    type: INSTANCE_SAVE,
    payload: {
      afterAction: AFTER_ACTION_NEW
    }
  }),


  // TODO: implement reducer.
  saveAndNextInstance = _ => ({
    type: INSTANCE_SAVE,
    payload: {
      afterAction: AFTER_ACTION_NEXT
    }
  }),

  // █████████████████████████████████████████████████████████████████████████████████████████████████████████

  // TODO: implement reducer.
  exitEdit = _ => ({
    type: EDIT_EXIT
  }),

  // █████████████████████████████████████████████████████████████████████████████████████████████████████████

  // TODO: implement reducer.
  selectTab = activeTabName => ({
    type: TAB_SELECT,
    payload: { activeTabName }
  });
