import {
  FORM_FILTER_RESET,
  FORM_FILTER_UPDATE,
  INSTANCES_SEARCH,
  INSTANCE_SELECT,
  INSTANCE_DESELECT,
  ALL_INSTANCES_SELECT,
  ALL_INSTANCES_DESELECT,
  VIEW_NAME,
  VIEW_SOFT_REDIRECT
} from './constants';

export const
  softRedirectView = ({
    name = VIEW_NAME,
    state
  }) => ({
    type: VIEW_SOFT_REDIRECT,
    payload: {
      view: {
        name,
        state
      }
    }
  }),

  searchInstances = ({
    filter,
    sort,
    order,
    max,
    offset
  } = {}) => ({
    type: INSTANCES_SEARCH,
    payload: {
      filter,
      sort,
      order,
      max,
      offset
    }
  }),

  updateFormFilter = ({
    path,
    value
  }) => ({
    type: FORM_FILTER_UPDATE,
    payload: {
      path,
      value
    }
  }),

  resetFormFilter = _ => ({
    type: FORM_FILTER_RESET
  }),

  toggleSelected = ({ selected, instance }) => ({
    type: selected ? INSTANCE_SELECT : INSTANCE_DESELECT,
    payload: { instance }
  }),

  toggleSelectedAll = selected => ({
    type: selected ? ALL_INSTANCES_SELECT : ALL_INSTANCES_DESELECT
  });
