import isEqual from 'lodash/isEqual';
import { STATUS_READY } from '../common/constants';
import { storeState2appState } from '../lib';

// appStateChangeDetect is a function which returns Redux middleware
export default /* istanbul ignore next */ ({
  lastState,
  onTransition,
  modelDefinition
}) => ({ getState }) => next => action => {
  const rez = next(action);
  const storeState = getState();
  const activeViewName = storeState.common.activeViewName;

  if (!activeViewName || storeState.views[activeViewName].status !== STATUS_READY) {
    return rez;
  }

  if (action.meta && action.meta.source === 'owner' || !onTransition) {
    lastState = { // eslint-disable-line no-param-reassign
      store: storeState
    };

    return rez;
  }

  // XXX: updeep must be used in reducers for below store states comparison to work as expected.
  if (storeState === lastState.store) {
    return rez;
  }

  if (lastState.store && !lastState.app) {
    lastState.app = storeState2appState(lastState.store, modelDefinition); // eslint-disable-line no-param-reassign
  }

  const appState = storeState2appState(storeState, modelDefinition);

  if (!isEqual(appState, lastState.app)) {
    onTransition(appState);
  }

  lastState = { // eslint-disable-line no-param-reassign
    store: storeState,
    app: appState
  };

  return rez;
}
