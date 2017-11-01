import isEqual from 'lodash/isEqual';
import { STATUS_READY } from '../common/constants';

// appStateChangeDetect is a function which returns Redux middleware
export default ({
  lastState,
  onTransition,
  storeState2appState
}) => ({ getState }) => next => action => {
  const rez = next(action);
  const storeState = getState();

  if (storeState.views[storeState.common.activeViewName].status !== STATUS_READY) {
    return rez;
  }

  if (action.meta && action.meta.source === 'owner' || !onTransition) {
    lastState = {
      store: storeState
    };

    return rez;
  }

  // XXX: updeep must be used in reducers for below store states comparison to work as expected.
  if (storeState === lastState.store) {
    return rez;
  }

  if (lastState.store && !lastState.app) {
    lastState.app = storeState2appState(lastState.store);
  }

  const appState = storeState2appState(storeState);

  if (!isEqual(appState, lastState.app)) {
    onTransition(appState);
  }

  lastState = {
    store: storeState,
    app: appState
  };

  return rez;
}