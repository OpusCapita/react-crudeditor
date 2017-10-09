import {
  INSTANCE_SHOW,
  TAB_SELECT,
  VIEW_EXIT
} from './constants'

export const showInstance = ({
  instance,
  tab: activeTabName
}, source) => ({
  type: INSTANCE_SHOW,
  payload: {
    instance,
    activeTabName
  },
  meta: {
    source
  }
})

export const selectTab = activeTabName => ({
  type: TAB_SELECT,
  payload: { activeTabName }
});

export const exitView = _ => ({
  type: VIEW_EXIT
});
