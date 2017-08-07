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
  saveInstance = _ => ({
    type: INSTANCE_SAVE
  }),

  // █████████████████████████████████████████████████████████████████████████████████████████████████████████
  // █████████████████████████████████████████████████████████████████████████████████████████████████████████

  // TODO: implement reducer.
  saveAndNewInstance = _ => ({
    type: INSTANCE_SAVE,
    payload: { AFTER_ACTION_NEW }
  }),


  // TODO: implement reducer.
  saveAndNextInstance = _ => ({
    type: INSTANCE_SAVE,
    payload: { AFTER_ACTION_NEXT }
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
