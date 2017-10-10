import {
  VIEW_EXIT,
  INSTANCE_CREATE,
  INSTANCE_SAVE,
  TAB_SELECT
} from './constants';

export const

  // █████████████████████████████████████████████████████████████████████████████████████████████████████████

  createInstance = ({ instance }) => {
    console.log("___createInstance______INSTANCE______\n" + JSON.stringify(instance, null, 2) + "\n__________")
    return ({
      type: INSTANCE_CREATE,
      payload: { instance }
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
