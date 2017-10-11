import {
  VIEW_EXIT,
  INSTANCE_CREATE,
  INSTANCE_SAVE,
  TAB_SELECT,
  INSTANCE_FIELD_VALIDATE,
  INSTANCE_FIELD_CHANGE
} from './constants';

export const

  // █████████████████████████████████████████████████████████████████████████████████████████████████████████

  // search component dispatches it with a newely created instance
  // listener: search/workerSagas/create.js
  createInstance = ({ instance }) => ({
    type: INSTANCE_CREATE,
    payload: { instance }
  }),

  // █████████████████████████████████████████████████████████████████████████████████████████████████████████

  saveInstance = ({ instance }) => ({
    type: INSTANCE_SAVE,
    payload: { instance }
  }),

  // █████████████████████████████████████████████████████████████████████████████████████████████████████████

  exitView = _ => ({
    type: VIEW_EXIT
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
