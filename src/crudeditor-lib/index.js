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
  DEFAULT_VIEW,
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
    let viewState = cloneDeep(getViewState[activeViewName](storeState, modelDefinition))

    if (viewState && typeof viewState === 'object' && !Object.keys(viewState)) {
      viewState = null;
    }

    return viewState ?
      { name: activeViewName, state: viewState } :
      (activeViewName === DEFAULT_VIEW ? undefined : { name: activeViewName });
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
      console.log('constructor view', this.props.view);
    }

    componentWillReceiveProps(props) {
      onTransition = props.onTransition;
    }

    shouldComponentUpdate({ view }) {
      // Prevent duplicate API call when view name/state props are received in response to onTransition() call.

      console.log('shouldComponentUpdate view', view);
      let newView = cloneDeep(view);

      if (newView) {
        if (newView.state && typeof newView.state === 'object' && !Object.keys(newView.state).length) {
          delete newView.state;
        }
        if (!newView.state && (!newView.name || newView.name === DEFAULT_VIEW)) {
          newView = null;
        } else if (newView.state && !newView.name) {
          newView.name = DEFAULT_VIEW;
        }
      }

      /*
       * By now, newView can
       *   -- be falsy, if name is DEFAULT_VIEW and state is {},
       *   -- have only name, if name is not DEFAULT_VIEW and state is {},
       *   -- have both name and state, if state is not {}.
       * => newView cannot have only state.
       */

      const currentView = storeState2appState(store.getState());

      // TODO: more sofisticated comparison by stripping defaults/EMPTY_FIELD_VALUE off newView.
      return !newView && !currentView ?
        false :
        !isEqual(newView, currentView);
    }

    render = _ =>
      (<Provider store={store}>
        <Main
          viewName={this.props.view ? this.props.view.name : undefined}
          viewState={this.props.view ? this.props.view.state : undefined}
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

