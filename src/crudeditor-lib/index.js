import React from 'react';
import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { Provider } from 'react-redux';
import isEqual from 'lodash/isEqual';
import cloneDeep from 'lodash/cloneDeep';

import buildFieldComponent from './components/DefaultFieldInput';
import { buildFormLayout } from './views/lib';
import Main from './components/Main';
import getReducer from './rootReducer';
import rootSaga from './rootSaga';
import { getViewState as getSearchViewState } from './views/search/selectors';
import { getViewState as getCreateViewState } from './views/create/selectors';
import { getViewState as getEditViewState } from './views/edit/selectors';
//import { getViewState as getShowViewState } from './views/show/selectors';

import {
  AUDITABLE_FIELDS,
  DEFAULT_FIELD_TYPE,
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

function fillDefaults(baseModelDefinition) {
  // Filling modelDefinition with default values where necessary.
  const modelDefinition = cloneDeep(baseModelDefinition);

  if (!modelDefinition.ui) {
    modelDefinition.ui = {};
  }

  modelDefinition.ui.instanceLabel = modelDefinition.ui.instanceLabel ?
    modelDefinition.ui.instanceLabel :
    ({ _objectLabel }) => _objectLabel;

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
      filter(name => !AUDITABLE_FIELDS.includes(name)).
      map(name => ({ name }));
  }

  searchMeta.searchableFields.forEach(field => {
    if (!field.Component) {
      field.Component = buildFieldComponent(fieldsMeta[field.name].type);
    }
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

  const storeState2appState = storeState => {
    const { activeViewName } = storeState.common;

    return {
      name: activeViewName,
      state: cloneDeep(getViewState[activeViewName](storeState, modelDefinition))
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

    render = _ =>
      <Provider store={store}>
        <Main
          viewName={this.props.view.name}
          viewState={this.props.view.state}
          modelDefinition={modelDefinition}
        />
      </Provider>
  }
};
