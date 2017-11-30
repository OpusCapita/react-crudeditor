import {
  INSTANCE_SHOW,
  TAB_SELECT,
  INSTANCE_SHOW_ADJACENT
} from './constants'

export const showInstance = ({
  instance,
  tab,
  navigation
}) => ({
  type: INSTANCE_SHOW,
  payload: {
    instance,
    tab,
    navigation
  }
})

export const selectTab = tabName => ({
  type: TAB_SELECT,
  payload: { tabName }
});

export const showAdjacentInstance = side => ({
  type: INSTANCE_SHOW_ADJACENT,
  payload: { side }
});
