import {
  INSTANCE_SAVE,
  TAB_SELECT,
  INSTANCE_FIELD_VALIDATE,
  INSTANCE_FIELD_CHANGE,
  AFTER_ACTION_NEW
} from './constants';

export const

  // █████████████████████████████████████████████████████████████████████████████████████████████████████████

  saveInstance = _ => ({
    type: INSTANCE_SAVE
  }),

  // █████████████████████████████████████████████████████████████████████████████████████████████████████████

  selectTab = tabName => ({
    type: TAB_SELECT,
    payload: { tabName }
  }),

  validateInstanceField = fieldName => ({
    type: INSTANCE_FIELD_VALIDATE,
    payload: {
      name: fieldName
    }
  }),

  saveAndNewInstance = _ => ({
    type: INSTANCE_SAVE,
    payload: {
      afterAction: AFTER_ACTION_NEW
    }
  }),

  changeInstanceField = ({
    name: fieldName,
    value: fieldNewValue
  }) => ({
    type: INSTANCE_FIELD_CHANGE,
    payload: {
      name: fieldName,
      value: fieldNewValue
    }
  });
