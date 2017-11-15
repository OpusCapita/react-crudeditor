import React from 'react';
import PropTypes from 'prop-types';
import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { Provider } from './connectExtended';
import isEqual from 'lodash/isEqual';
import cloneDeep from 'lodash/cloneDeep';
import { I18nManager } from '@opuscapita/i18n';
import crudTranslations from './i18n';
import notificationsMiddleware from './middleware/notifications';
import appStateChangeDetect from './middleware/appStateChangeDetect';

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

const fillDefaults = baseModelDefinition => {
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

  if (!modelDefinition.ui.instanceLabel) {
    modelDefinition.ui.instanceLabel = ({ _objectLabel }) => _objectLabel;
  }

  Object.keys(getUi).forEach(viewName => {
    if (getUi[viewName]) {
      modelDefinition.ui[viewName] = getUi[viewName](modelDefinition);
    }
  })

  return modelDefinition;
}

const storeState2appState = (storeState, modelDefinition) => ({
  name: storeState.common.activeViewName,
  state: cloneDeep(getViewState[storeState.common.activeViewName](storeState, modelDefinition))
});

export default baseModelDefinition => {
  let lastState = {}; // TBD leave lastState here, in closure?

  // context for CrudWrapper children
  const context = {};

  class CrudWrapper extends React.Component {
    static propTypes = {
      view: PropTypes.shape({
        name: PropTypes.string,
        state: PropTypes.object
      }),
      onTransition: PropTypes.func
    }

    static propTypes = {
      locale: PropTypes.string,
      fallbackLocale: PropTypes.string,
      localeFormattingInfo: PropTypes.object
    };

    static contextTypes = {
      i18n: PropTypes.object
    };

    static childContextTypes = {
      i18n: PropTypes.object
    };

    static defaultProps = {
      locale: 'en',
      fallbackLocale: 'en'
    };

    constructor(props, context) {
      super(props, context);

      this.onTransition = this.props.onTransition;

      this.modelDefinition = fillDefaults(baseModelDefinition);
      const sagaMiddleware = createSagaMiddleware();

      this.store = createStore(
        getReducer(this.modelDefinition),
        (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose)(applyMiddleware(
          // XXX: ensure each middleware calls "next(action)" synchronously,
          // or else ensure that "redux-saga" is the last middleware in the call chain.
          appStateChangeDetect({
            lastState,
            onTransition: this.onTransition,
            storeState2appState,
            modelDefinition: this.modelDefinition
          }),
          notificationsMiddleware(context),
          sagaMiddleware
        ))
      );

      this.crudSaga = sagaMiddleware.run(rootSaga, this.modelDefinition);

      this.initI18n(props);
    }

    getChildContext() {
      const i18n = (this.context && this.context.i18n) || this.i18n;
      // core crud translations
      i18n.register('CrudEditor', crudTranslations);
      // model translations
      i18n.register('Model', this.modelDefinition.model.translations);

      context.i18n = i18n;
      return context;
    }

    componentWillReceiveProps(props) {
      this.onTransition = props.onTransition;
    }

    // Prevent duplicate API call when view name/state props are received in response to onTransition() call.
    // TODO: more sofisticated comparison by stripping defaults/EMPTY_FIELD_VALUE off newView.
    shouldComponentUpdate = ({
      view: {
        name = DEFAULT_VIEW,
        state = {}
      } = {}
    }) => !isEqual(storeState2appState(this.store.getState(), this.modelDefinition), { name, state })

    componentWillUnmount() {
      this.crudSaga.cancel()
    }

    // create our own i18n context
    // if i18n context is already passed from the outside -> oughter one is used
    initI18n(props) {
      const {
        locale,
        fallbackLocale,
        localeFormattingInfo
      } = props;

      this.i18n = new I18nManager({ locale, fallbackLocale, localeFormattingInfo });
    }

    render = _ =>
      (<Provider store={this.store}>
        <Main
          viewName={this.props.view ? this.props.view.name : undefined}
          viewState={this.props.view ? this.props.view.state : undefined}
          modelDefinition={this.modelDefinition}
        />
      </Provider>)
  }

  return CrudWrapper
};

