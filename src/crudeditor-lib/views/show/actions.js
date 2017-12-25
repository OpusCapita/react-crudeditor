import {
  TAB_SELECT,
  ADJACENT_INSTANCE_SHOW
} from './constants'

export const

  selectTab = tabName => ({
    type: TAB_SELECT,
    payload: { tabName }
  }),

  showPreviousInstance = _ => ({
    type: ADJACENT_INSTANCE_SHOW,
    payload: {
      step: -1
    }
  }),

  showNextInstance = _ => ({
    type: ADJACENT_INSTANCE_SHOW,
    payload: {
      step: 1
    }
  });
