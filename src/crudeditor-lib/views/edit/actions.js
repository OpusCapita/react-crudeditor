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

  changeInstanceField = /* istanbul ignore next */ ({
    name: fieldName,
    value: fieldNewValue
  }) => ({
    type: INSTANCE_FIELD_CHANGE,
    payload: {
      name: fieldName,
      value: fieldNewValue
    }
  }),

  validateInstanceField = /* istanbul ignore next */ fieldName => ({
    type: INSTANCE_FIELD_VALIDATE,
    payload: {
      name: fieldName
    }
  }),

  saveInstance = /* istanbul ignore next */ _ => ({
    type: INSTANCE_SAVE
  }),

  saveAndNewInstance = /* istanbul ignore next */ _ => ({
    type: INSTANCE_SAVE,
    payload: {
      afterAction: AFTER_ACTION_NEW
    }
  }),

  saveAndNextInstance = /* istanbul ignore next */ _ => ({
    type: INSTANCE_SAVE,
    payload: {
      afterAction: AFTER_ACTION_NEXT
    }
  }),

  selectTab = /* istanbul ignore next */ tabName => ({
    type: TAB_SELECT,
    payload: { tabName }
  }),

  editPreviousInstance = /* istanbul ignore next */ _ => ({
    type: ADJACENT_INSTANCE_EDIT,
    payload: {
      step: -1
    }
  }),

  editNextInstance = /* istanbul ignore next */ _ => ({
    type: ADJACENT_INSTANCE_EDIT,
    payload: {
      step: 1
    }
  });
