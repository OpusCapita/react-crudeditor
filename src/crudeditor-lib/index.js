import React, { Component } from 'react';
import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { Provider } from 'react-redux';
import isEqual from 'lodash/isEqual';
import cloneDeep from 'lodash/cloneDeep';

import Main from './common/components/Main';
import getReducer from './rootReducer';
import rootSaga from './rootSaga';
import { constants } from './common';

const {
  VIEW_SEARCH,
  VIEW_CREATE,
  VIEW_EDIT,
  VIEW_SHOW,
  VIEW_ERROR
} = constants;

const storeState2appState = storeState => {
  const activeView = storeState.common.exposable.activeView;
  const viewStoreState = storeState.views[activeView];

  return {
    view: activeView,
    state:
      activeView === VIEW_SEARCH && {
        filter : cloneDeep(viewStoreState.resultFilter),
        sort   : viewStoreState.sortParams.sort,
        order  : viewStoreState.sortParams.order,
        max    : viewStoreState.pageParams.max,
        offset : viewStoreState.pageParams.offset
      } ||
      activeView === VIEW_CREATE && {} ||
      activeView === VIEW_EDIT && {
        //instance: cloneDeep(viewStoreState.persistentInstance),
        id  : viewStoreState.persistentInstance.id,  // TBD : what if id is complex???
        tab : viewStoreState.tab
      } ||
      activeView === VIEW_SHOW && {
        //instance: cloneDeep(viewStoreState.instance),
        id  : viewStoreState.instance.id,  // TBD : what if id is complex???
        tab : viewStoreState.tab
      } ||
      activeView === VIEW_ERROR && {
        code    : viewStoreState.code,
        payload : cloneDeep(viewStoreState.payload)
      }
};

export default entityConfiguration => {
  let onTransition = null;
  const sagaMiddleware = createSagaMiddleware();

  const appStateChangeDetect = ({ getState }) => next => action => {
    if (action.meta.source === 'owner' || !onTransition) {
      return next(action);
    }

    const oldStoreState = getState();
    const rez = next(action);
    const newStoreState = getState();

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

  return class extends Component {
    constructor(...args) {
      super(...args);
      onTransition = this.props.onTransition;
    }

    componentWillReceiveProps(props) {
      onTransition = props.onTransition;
    }

    render() {
      const { view, state } = this.props;

      return (
        <Provider store={store}>
          <Main viewName={view} viewState={state} />
        </Provider>
      );
    }
  }
}
