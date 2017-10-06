import {
  INSTANCES_DELETE,
  VIEW_HARD_REDIRECT
} from './constants';

export const
  hardRedirectView = ({
    viewName,
    viewState
  }) => ({
    type: VIEW_HARD_REDIRECT,
    payload: {
      viewName,
      viewState
    },
    meta: {
      source: 'owner'
    }
  }),

  deleteInstances = instances => ({
    type: INSTANCES_DELETE,
    payload: {
      instances: Array.isArray(instances) ? instances : [instances]
    }
  });
