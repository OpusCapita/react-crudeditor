import {
  INSTANCE_SHOW,
  TAB_SELECT,
  VIEW_EXIT
} from './constants'

export const showInstance = ({
  instance,
  tab
}) => ({
  type: INSTANCE_SHOW,
  payload: {
    instance,
    tab
  }
})

export const selectTab = tabName => ({
  type: TAB_SELECT,
  payload: { tabName }
});

export const exitView = _ => ({
  type: VIEW_EXIT
});
