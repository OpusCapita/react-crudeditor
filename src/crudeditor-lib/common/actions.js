import {
  INSTANCES_DELETE,
  VIEW_HARD_REDIRECT,
  VIEW_SOFT_REDIRECT
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

  softRedirectView = ({
    name,
    state = {},
    ...additionalArgs
  }) => ({
    type: VIEW_SOFT_REDIRECT,
    payload: {
      view: {
        name,
        state
      },
      ...additionalArgs
    }
  }),

  deleteInstances = instances => ({
    type: INSTANCES_DELETE,
    payload: {
      instances: Array.isArray(instances) ? instances : [instances]
    }
  });
