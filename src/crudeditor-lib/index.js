import React from 'react';
import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { Provider } from 'react-redux';
import isEqual from 'lodash/isEqual';
import cloneDeep from 'lodash/cloneDeep';

import Main from './components/Main';
import getReducer from './rootReducer';
import rootSaga from './rootSaga';
import { getViewState as getSearchViewState } from './views/search/selectors';
import { getViewState as getCreateViewState } from './views/create/selectors';
import { getViewState as getEditViewState } from './views/edit/selectors';
//import { getViewState as getShowViewState } from './views/show/selectors';

import {
  VIEW_SEARCH,
  VIEW_CREATE,
  VIEW_EDIT,
  VIEW_SHOW,
  VIEW_ERROR
} from './common/constants';

const getViewState = {
  [VIEW_SEARCH] : getSearchViewState,
  [VIEW_CREATE] : getCreateViewState,
  [VIEW_EDIT  ] : getEditViewState,
//[VIEW_SHOW  ] : getShowViewState
}

export default entityConfiguration => {
  const storeState2appState = storeState => {
    const { activeViewName } = storeState.common;

    return {
      name: activeViewName,
      state: cloneDeep(getViewState[activeViewName](storeState, entityConfiguration))
    }
  };


  const appStateChangeDetect = ({ getState }) => next => action => {
    if (action.meta && action.meta.source === 'owner' || !onTransition) {
      return next(action);
    }

    const oldStoreState = getState();
    const rez = next(action);
    const newStoreState = getState();

    if (newStoreState.common.activeViewName === VIEW_ERROR) {
      return rez;
    }

    // XXX: updeep must be used in reducers for below store states comparison to work as expected.
    if (oldStoreState === newStoreState) {
      return rez;
    }

    const oldAppState = storeState2appState(oldStoreState);
    const newAppState = storeState2appState(newStoreState);

    if (!isEqual(oldAppState, newAppState)) {
      onTransition(newAppState);
    }

    return rez;
  }

  let onTransition = null;
  const sagaMiddleware = createSagaMiddleware();

  const store = createStore(
    getReducer(entityConfiguration),
    (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose)(applyMiddleware(
      // XXX: ensure each middleware calls "next(action)" synchronously,
      // or else ensure that "redux-saga" is the last middleware in the call chain.
      appStateChangeDetect,
      sagaMiddleware
    ))
  );

  sagaMiddleware.run(rootSaga, entityConfiguration);

  return class extends React.Component {
    constructor(...args) {
      super(...args);
      onTransition = this.props.onTransition;
    }

    componentWillReceiveProps(props) {
      onTransition = props.onTransition;
    }

    render() {
      const { name, state } = this.props.view;

      return (
        <Provider store={store}>
          <Main viewName={name} viewState={state} />
        </Provider>
      );
    }
  }
};
