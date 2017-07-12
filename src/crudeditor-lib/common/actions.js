import { VIEW_INITIALIZE } from './constants';

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
  });
