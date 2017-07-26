import {
  EDIT_EXIT,
  INSTANCE_EDIT,
  INSTANCE_FIELD_VALIDATE,
  INSTANCE_FIELD_CHANGE,
  INSTANCE_SAVE,
  TAB_SELECT
} from './constants';

export const

  // █████████████████████████████████████████████████████████████████████████████████████████████████████████

  editInstance = ({
    id,
    tab: activeTabName
  }, source) => ({
    type: INSTANCE_EDIT,
    payload: {
      id,
      activeTabName
    },
    meta: {
      source
    }
  }),

  // █████████████████████████████████████████████████████████████████████████████████████████████████████████

  // TODO: implement reducer.
  changeInstanceField = (field, value) => ({
    type: INSTANCE_FIELD_CHANGE,
    payload: {
      field,
      value
    }
  }),

  // █████████████████████████████████████████████████████████████████████████████████████████████████████████

  // TODO: implement reducer.
  validateInstanceField = field => ({
    type: INSTANCE_FIELD_VALIDATE,
    payload: {
      field
    }
  }),

  // █████████████████████████████████████████████████████████████████████████████████████████████████████████

  // TODO: implement reducer.
  saveInstance = afterAction => ({
    type: INSTANCE_SAVE,
    payload: { afterAction }
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
