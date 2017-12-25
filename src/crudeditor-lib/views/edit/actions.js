import {
  AFTER_ACTION_NEW,
  AFTER_ACTION_NEXT,
  INSTANCE_FIELD_VALIDATE,
  INSTANCE_FIELD_CHANGE,
  INSTANCE_SAVE,
  TAB_SELECT,
  ADJACENT_INSTANCE_EDIT
} from './constants';

export const

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

  validateInstanceField = fieldName => ({
    type: INSTANCE_FIELD_VALIDATE,
    payload: {
      name: fieldName
    }
  }),

  saveInstance = _ => ({
    type: INSTANCE_SAVE
  }),

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

  selectTab = tabName => ({
    type: TAB_SELECT,
    payload: { tabName }
  }),

  editPreviousInstance = _ => ({
    type: ADJACENT_INSTANCE_EDIT,
    payload: {
      step: -1
    }
  }),

  editNextInstance = _ => ({
    type: ADJACENT_INSTANCE_EDIT,
    payload: {
      step: 1
    }
  });
