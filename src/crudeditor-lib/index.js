import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { Provider } from 'react-redux';
import isEqual from 'lodash/isEqual';
import hash from 'object-hash';
import crudTranslations from './i18n';
import notificationsMiddleware from './middleware/notifications';
import appStateChangeDetect from './middleware/appStateChangeDetect';
import Main from './components/Main';
import getReducer from './rootReducer';
import rootSaga from './rootSaga';

import {
  DEFAULT_FIELD_TYPE,
  DEFAULT_VIEW,
  VIEW_CREATE,
  VIEW_EDIT,
  VIEW_SEARCH,
  VIEW_SHOW
} from './common/constants';

import {
  storeState2appState,
  fillDefaults,
  getPrefixedTranslations
} from './lib';

import {
  FIELD_TYPE_BOOLEAN,
  FIELD_TYPE_DECIMAL,
  FIELD_TYPE_INTEGER,
  FIELD_TYPE_STRING,
  FIELD_TYPE_STRING_DATE,
  FIELD_TYPE_STRING_DECIMAL,
  FIELD_TYPE_STRING_INTEGER,
  FIELD_TYPE_DECIMAL_RANGE,
  FIELD_TYPE_INTEGER_RANGE,
  FIELD_TYPE_STRING_DATE_RANGE,
  FIELD_TYPE_STRING_DECIMAL_RANGE,
  FIELD_TYPE_STRING_INTEGER_RANGE,
  UI_TYPE_BOOLEAN,
  UI_TYPE_DATE,
  UI_TYPE_DECIMAL,
  UI_TYPE_INTEGER,
  UI_TYPE_STRING,
  UI_TYPE_DATE_RANGE_OBJECT,
  UI_TYPE_DECIMAL_RANGE_OBJECT,
  UI_TYPE_INTEGER_RANGE_OBJECT,
  UI_TYPE_STRING_RANGE_OBJECT
} from '../data-types-lib/constants';

import {
  COMPONENT_NAME_INPUT as BUILTIN_INPUT,
  COMPONENT_NAME_RANGE_INPUT as BUILTIN_RANGE_INPUT
} from './views/lib';

export {
  VIEW_CREATE,
  VIEW_EDIT,
  VIEW_SEARCH,
  VIEW_SHOW,

  DEFAULT_FIELD_TYPE,
  FIELD_TYPE_BOOLEAN,
  FIELD_TYPE_DECIMAL,
  FIELD_TYPE_INTEGER,
  FIELD_TYPE_STRING,
  FIELD_TYPE_STRING_DATE,
  FIELD_TYPE_STRING_DECIMAL,
  FIELD_TYPE_STRING_INTEGER,
  FIELD_TYPE_DECIMAL_RANGE,
  FIELD_TYPE_INTEGER_RANGE,
  FIELD_TYPE_STRING_DATE_RANGE,
  FIELD_TYPE_STRING_DECIMAL_RANGE,
  FIELD_TYPE_STRING_INTEGER_RANGE,
  UI_TYPE_BOOLEAN,
  UI_TYPE_DATE,
  UI_TYPE_DECIMAL,
  UI_TYPE_INTEGER,
  UI_TYPE_STRING,
  UI_TYPE_DATE_RANGE_OBJECT,
  UI_TYPE_DECIMAL_RANGE_OBJECT,
  UI_TYPE_INTEGER_RANGE_OBJECT,
  UI_TYPE_STRING_RANGE_OBJECT,

  BUILTIN_INPUT,
  BUILTIN_RANGE_INPUT
}

const appName = 'crudEditor';

export default baseModelDefinition => {
  const modelDefinition = fillDefaults(baseModelDefinition);
  const prefix = `${appName}.${hash(modelDefinition)}`;

  let onTransition = null;
  let lastState = {};

  class CrudWrapper extends Component {
    static propTypes = {
      view: PropTypes.shape({
        name: PropTypes.string,
        state: PropTypes.object
      }),
      onTransition: PropTypes.func,
      externalOperations: PropTypes.func,
      uiConfig: PropTypes.shape({
        headerLevel: PropTypes.number
      })
    }

    static contextTypes = {
      i18n: PropTypes.object.isRequired // important
    };

    static childContextTypes = {
      i18n: PropTypes.object.isRequired
    }

    static defaultProps = {
      externalOperations: _ => [],
      uiConfig: {}
    };

    constructor(...args) {
      super(...args);
      onTransition = this.props.onTransition;

      // core crud translations
      this.context.i18n.register(appName, crudTranslations);

      // model translations
      const prefixedTranslations = getPrefixedTranslations(modelDefinition.model.translations, prefix);
      this.context.i18n.register(prefix, prefixedTranslations);

      const modelMessageKeys = Object.keys(modelDefinition.model.translations).reduce(
        (acc, lang) => [
          ...acc,
          ...Object.keys(modelDefinition.model.translations[lang])
        ],
        []
      );

      const originalI18n = this.context.i18n;

      const adjustedI18n = Object.create(originalI18n, {
        // this method mimics @opuscapita/i18n getMessage
        // it queries for prefixed model messages to allow multi-model/multi-crud apps
        getMessage: {
          get() {
            return (key, args) => originalI18n.getMessage(
              modelMessageKeys.indexOf(key) > -1 ? `${prefix}.${key}` : key,
              args
            );
          }
        }
      });

      this.adjustedContext = {
        i18n: adjustedI18n
      };

      const sagaMiddleware = createSagaMiddleware();

      this.store = createStore(
        getReducer(modelDefinition, adjustedI18n),
        (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose)(applyMiddleware(
          // XXX: ensure each middleware calls "next(action)" synchronously,
          // or else ensure that "redux-saga" is the last middleware in the call chain.
          appStateChangeDetect({
            lastState,
            get onTransition() {
              return onTransition;
            },
            modelDefinition
          }),

          notificationsMiddleware({
            i18n: adjustedI18n,
            modelDefinition
          }),

          sagaMiddleware
        ))
      );

      this.runningSaga = sagaMiddleware.run(rootSaga, modelDefinition);
    }

    getChildContext() {
      return this.adjustedContext;
    }

    componentWillReceiveProps(nextProps) {
      onTransition = nextProps.onTransition;
    }

    // Prevent duplicate API call when view name/state props are received in response to onTransition() call.
    // TODO: more sofisticated comparison by stripping defaults/EMPTY_FIELD_VALUE off newView.
    shouldComponentUpdate = ({
      view: {
        name = DEFAULT_VIEW,
        state = {}
      } = {}
    }) => !isEqual(storeState2appState(this.store.getState(), modelDefinition), { name, state })

    componentWillUnmount() {
      this.runningSaga.cancel()
    }

    render = _ =>
      (<Provider store={this.store}>
        <Main
          viewName={this.props.view ? this.props.view.name : undefined}
          viewState={this.props.view ? this.props.view.state : undefined}
          modelDefinition={modelDefinition}
          externalOperations={this.props.externalOperations}
          uiConfig={this.props.uiConfig}
        />
      </Provider>)
  }

  return CrudWrapper;
};
