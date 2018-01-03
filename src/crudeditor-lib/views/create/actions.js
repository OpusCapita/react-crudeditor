import {
  INSTANCE_SAVE,
  TAB_SELECT,
  INSTANCE_FIELD_VALIDATE,
  INSTANCE_FIELD_CHANGE,
  AFTER_ACTION_NEW
} from './constants';

export const

  // █████████████████████████████████████████████████████████████████████████████████████████████████████████

  saveInstance = /* istanbul ignore next */ _ => ({
    type: INSTANCE_SAVE
  }),

  // █████████████████████████████████████████████████████████████████████████████████████████████████████████

  selectTab = /* istanbul ignore next */ tabName => ({
    type: TAB_SELECT,
    payload: { tabName }
  }),

  validateInstanceField = /* istanbul ignore next */ fieldName => ({
    type: INSTANCE_FIELD_VALIDATE,
    payload: {
      name: fieldName
    }
  }),

  saveAndNewInstance = /* istanbul ignore next */ _ => ({
    type: INSTANCE_SAVE,
    payload: {
      afterAction: AFTER_ACTION_NEW
    }
  }),

  changeInstanceField = /* istanbul ignore next */ ({
    name: fieldName,
    value: fieldNewValue
  }) => ({
    type: INSTANCE_FIELD_CHANGE,
    payload: {
      name: fieldName,
      value: fieldNewValue
    }
  });
