import {
  INSTANCES_DELETE,
  VIEW_INITIALIZE
} from './constants';

export const
  initializeView = ({
    viewName,
    viewState
  }) => ({
    type: VIEW_INITIALIZE,
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
