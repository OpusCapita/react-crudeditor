import {
  INSTANCE_SHOW,
  TAB_SELECT,
  VIEW_EXIT,
  INSTANCE_SHOW_ADJACENT
} from './constants'

export const showInstance = ({
  instance,
  tab,
  searchParams
}) => ({
  type: INSTANCE_SHOW,
  payload: {
    instance,
    tab,
    searchParams
  }
})

export const selectTab = tabName => ({
  type: TAB_SELECT,
  payload: { tabName }
});

export const exitView = _ => ({
  type: VIEW_EXIT
});

export const showAdjacentInstance = side => ({
  type: INSTANCE_SHOW_ADJACENT,
  payload: { side }
});
