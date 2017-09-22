import {
  FORM_FILTER_RESET,
  FORM_FILTER_UPDATE,
  FORM_FILTER_PARSE,
  INSTANCES_SEARCH,
  INSTANCE_SELECT,
  INSTANCE_DESELECT,
  ALL_INSTANCES_SELECT,
  ALL_INSTANCES_DESELECT
} from './constants';

export const
  searchInstances = ({
    filter,
    sort,
    order,
    max,
    offset
  } = {}, source) => ({
    type: INSTANCES_SEARCH,
    payload: {
      filter,
      sort,
      order,
      max,
      offset
    },
    meta: { source }
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

  parseFormFilter = path => ({
    type: FORM_FILTER_PARSE,
    payload: { path }
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
