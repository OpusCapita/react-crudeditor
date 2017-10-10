import React from 'react';
import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { Provider } from 'react-redux';
import isEqual from 'lodash/isEqual';
import cloneDeep from 'lodash/cloneDeep';

import {
  buildFieldRender,
  buildFormLayout
} from './views/lib';

import Main from './components/Main';
import getReducer from './rootReducer';
import rootSaga from './rootSaga';
import { RANGE_FIELD_TYPES } from './views/search/constants';

import { getViewState as getSearchViewState } from './views/search/selectors';
import { getViewState as getCreateViewState } from './views/create/selectors';
import { getViewState as getEditViewState } from './views/edit/selectors';
import { getViewState as getShowViewState } from './views/show/selectors';
import { getViewState as getErrorViewState } from './views/error/selectors';

import {
  AUDITABLE_FIELDS,
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

function fillDefaults(baseModelDefinition) {
  // Filling modelDefinition with default values where necessary.
  const modelDefinition = cloneDeep(baseModelDefinition);

  if (!modelDefinition.ui) {
    modelDefinition.ui = {};
  }

  modelDefinition.ui.instanceLabel = modelDefinition.ui.instanceLabel ?
    modelDefinition.ui.instanceLabel :
    ({ _objectLabel }) => _objectLabel;

  if (!modelDefinition.model.validate) {
    modelDefinition.model.validate = _ => true;
  }

  const fieldsMeta = modelDefinition.model.fields;

  Object.keys(fieldsMeta).forEach(fieldName => {
    if (!fieldsMeta[fieldName].type) {
      fieldsMeta[fieldName].type = DEFAULT_FIELD_TYPE;
    }

    if (!fieldsMeta[fieldName].constraints) {
      fieldsMeta[fieldName].constraints = {};
    }
  });

  const searchMeta = modelDefinition.ui.search = modelDefinition.ui.search ?
    modelDefinition.ui.search() :
    {};

  if (!searchMeta.resultFields) {
    searchMeta.resultFields = Object.keys(fieldsMeta).map(name => ({ name }));
  }

  if (!searchMeta.searchableFields) {
    searchMeta.searchableFields = Object.keys(fieldsMeta).
      filter(name => AUDITABLE_FIELDS.indexOf(name) === -1).
      map(name => ({ name }));
  }

  searchMeta.searchableFields.forEach(field => {
    if (field.render) {
      if (!field.render.Component) {
        throw new Error(`searchableField "${field.name}" must have render.Component since custom render is specified`);
      }
      if (field.render.hasOwnProperty('isRange')) {
        // field.render has isRange and it is set to true.
        throw new Error(
          `searchableField "${field.name}" must not have render.isRange since custom render is specified`
        );
      }
    }

    field.render = { // eslint-disable-line no-param-reassign
      isRange: field.render ?
        false :
        RANGE_FIELD_TYPES.indexOf(fieldsMeta[field.name].type) !== -1,

      ...buildFieldRender({
        render: field.render,
        type: fieldsMeta[field.name].type
      }),
    };
  });

  if (!modelDefinition.ui.edit) {
    modelDefinition.ui.edit = {};
  }

  const editMeta = modelDefinition.ui.edit;

  editMeta.formLayout = buildFormLayout({
    customBuilder: editMeta.formLayout,
    viewName: VIEW_EDIT,
    fieldsMeta: modelDefinition.model.fields
  });

  if (!modelDefinition.ui.create) {
    modelDefinition.ui.create = {};
  }

  if (!modelDefinition.ui.show) {
    modelDefinition.ui.show = {};
  }

  return modelDefinition;
}

export default baseModelDefinition => {
  const modelDefinition = fillDefaults(baseModelDefinition);
  let onTransition = null;
  let lastState = {};

  const storeState2appState = storeState => {
    const { activeViewName } = storeState.common;

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

  return class extends React.Component {
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
      return !isEqual(appState, storeState2appState(store.getState()));
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
};
