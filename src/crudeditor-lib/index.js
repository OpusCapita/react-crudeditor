import React from 'react';
import PropTypes from 'prop-types';
import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { Provider } from 'react-redux';
import isEqual from 'lodash/isEqual';
import cloneDeep from 'lodash/cloneDeep';

import Main from './components/Main';
import getReducer from './rootReducer';
import rootSaga from './rootSaga';

import { getViewState as getSearchViewState, getUi as getSearchUi } from './views/search';
import { getViewState as getCreateViewState, getUi as getCreateUi } from './views/create';
import { getViewState as getEditViewState, getUi as getEditUi } from './views/edit';
import { getViewState as getShowViewState, getUi as getShowUi } from './views/show';
import { getViewState as getErrorViewState } from './views/error';

import {
  DEFAULT_FIELD_TYPE,
  STATUS_READY,

  VIEW_SEARCH,
  VIEW_CREATE,
  VIEW_EDIT,
  VIEW_SHOW,
  VIEW_ERROR
} from './common/constants';

const getViewState = {
  [VIEW_SEARCH]: getSearchViewState,
  [VIEW_CREATE]: getCreateViewState,
  [VIEW_EDIT]: getEditViewState,
  [VIEW_SHOW]: getShowViewState,
  [VIEW_ERROR]: getErrorViewState
};

const getUi = {
  [VIEW_SEARCH]: getSearchUi,
  [VIEW_CREATE]: getCreateUi,
  [VIEW_EDIT]: getEditUi,
  [VIEW_SHOW]: getShowUi
};

function fillDefaults(baseModelDefinition) {
  // Filling modelDefinition with default values where necessary.
  const modelDefinition = cloneDeep(baseModelDefinition);
  const fieldsMeta = modelDefinition.model.fields;

  Object.keys(fieldsMeta).forEach(fieldName => {
    if (!fieldsMeta[fieldName].type) {
      fieldsMeta[fieldName].type = DEFAULT_FIELD_TYPE;
    }

    if (!fieldsMeta[fieldName].constraints) {
      fieldsMeta[fieldName].constraints = {};
    }
  });

  if (!modelDefinition.model.validate) {
    modelDefinition.model.validate = _ => true;
  }

  if (!modelDefinition.ui) {
    modelDefinition.ui = {};
  }

  modelDefinition.ui.instanceLabel = modelDefinition.ui.instanceLabel ?
    modelDefinition.ui.instanceLabel :
    ({ _objectLabel }) => _objectLabel;

  Object.keys(getUi).forEach(viewName => {
    if (getUi[viewName]) {
      modelDefinition.ui[viewName] = getUi[viewName](modelDefinition);
    }
  })

  return modelDefinition;
}

export default baseModelDefinition => {
  const modelDefinition = fillDefaults(baseModelDefinition);
  let onTransition = null;
  let lastState = {};

  const storeState2appState = storeState => {
    const { activeViewName } = storeState.common;
    console.log("activeViewName: " + activeViewName)
    return {
      name: activeViewName,
      state: cloneDeep(getViewState[activeViewName](storeState, modelDefinition))
    }
  };

  const appStateChangeDetect = ({ getState }) => next => action => {
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
      console.log("sending");
      console.log(appState);
      console.log(lastState.app);
      onTransition(appState);
    }

    lastState = {
      store: storeState,
      app: appState
    };

    return rez;
  }

  const sagaMiddleware = createSagaMiddleware();

  const store = createStore(
    getReducer(modelDefinition),
    (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose)(applyMiddleware(
      // XXX: ensure each middleware calls "next(action)" synchronously,
      // or else ensure that "redux-saga" is the last middleware in the call chain.
      appStateChangeDetect,
      sagaMiddleware
    ))
  );

  sagaMiddleware.run(rootSaga, modelDefinition);

  class CrudWrapper extends React.Component {
    constructor(...args) {
      super(...args);
      onTransition = this.props.onTransition;
    }

    componentWillReceiveProps(props) {
      onTransition = props.onTransition;
    }

    shouldComponentUpdate({ view: appState }) {
      // Prevent duplicate API call when view name/state props are received in response to onTransition() call.

      // TODO: more sofisticated comparison
      // either by filling appState and storeState2appState()
      // with default values and EMPTY_FIELD_VALUE in filter fields of Search View,
      // or by removing default values and EMPTY_FIELD_VALUE in appState and storeState2appState().
      console.log("s")
      console.log(appState);
      console.log(storeState2appState(store.getState()));
      console.log("e")
      const eq = isEqual(appState, storeState2appState(store.getState()));
      console.log(eq)
      return !eq
    }

    render = _ =>
      (<Provider store={store}>
        <Main
          viewName={this.props.view.name}
          viewState={this.props.view.state}
          modelDefinition={modelDefinition}
        />
      </Provider>)
  }

  CrudWrapper.propTypes = {
    view: PropTypes.shape({
      name: PropTypes.string,
      state: PropTypes.object
    }),
    onTransition: PropTypes.func
  }

  return CrudWrapper
};

