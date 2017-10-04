import {
  INSTANCES_DELETE,
  VIEW_REDIRECT_FORCE
} from './constants';

export const
  initializeView = ({
    viewName,
    viewState
  }) => ({
    type: VIEW_REDIRECT_FORCE,
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
