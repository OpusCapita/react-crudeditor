import {
  VIEW_EXIT,
  INSTANCE_CREATE,
  INSTANCE_SAVE,
  TAB_SELECT
} from './constants';

export const

  // █████████████████████████████████████████████████████████████████████████████████████████████████████████

  createInstance = _ => {
    return ({
      type: INSTANCE_CREATE
    })
  },

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
  });
