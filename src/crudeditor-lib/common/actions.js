import {
  INSTANCES_CUSTOM,
  INSTANCES_DELETE,
  VIEW_HARD_REDIRECT,
  VIEW_SOFT_REDIRECT
} from './constants';

export const
  hardRedirectView = /* istanbul ignore next */ ({
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

  softRedirectView = /* istanbul ignore next */ ({
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

  deleteInstances = /* istanbul ignore next */ instances => ({
    type: INSTANCES_DELETE,
    payload: {
      instances: Array.isArray(instances) ? instances : [instances]
    }
  }),

  customBulkAction = (instances, action) => ({
    type: INSTANCES_CUSTOM,
    payload: {
      instances: Array.isArray(instances) ? instances : [instances],
      customBulkOperationFunction: action,
    }
  });
