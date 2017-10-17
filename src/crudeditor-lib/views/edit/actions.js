import {
  AFTER_ACTION_NEW,
  AFTER_ACTION_NEXT,
  VIEW_EXIT,
  INSTANCE_EDIT,
  INSTANCE_FIELD_VALIDATE,
  INSTANCE_FIELD_CHANGE,
  INSTANCE_SAVE,
  TAB_SELECT
} from './constants';

export const

  // █████████████████████████████████████████████████████████████████████████████████████████████████████████

  editInstance = ({
    instance,
    tab
  }) => ({
    type: INSTANCE_EDIT,
    payload: {
      instance,
      tab
    }
  }),

  // █████████████████████████████████████████████████████████████████████████████████████████████████████████

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

  validateInstanceField = fieldName => ({
    type: INSTANCE_FIELD_VALIDATE,
    payload: {
      name: fieldName
    }
  }),

  // █████████████████████████████████████████████████████████████████████████████████████████████████████████

  saveInstance = _ => ({
    type: INSTANCE_SAVE
  }),

  // █████████████████████████████████████████████████████████████████████████████████████████████████████████

  saveAndNewInstance = _ => ({
    type: INSTANCE_SAVE,
    payload: {
      afterAction: AFTER_ACTION_NEW
    }
  }),


  saveAndNextInstance = _ => ({
    type: INSTANCE_SAVE,
    payload: {
      afterAction: AFTER_ACTION_NEXT
    }
  }),

  // █████████████████████████████████████████████████████████████████████████████████████████████████████████

  exitView = _ => ({
    type: VIEW_EXIT
  }),

  // █████████████████████████████████████████████████████████████████████████████████████████████████████████

  selectTab = tabName => ({
    type: TAB_SELECT,
    payload: { tabName }
  });
