import React from 'react';
import PropTypes from 'prop-types';
import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { Provider } from 'react-redux';
import isEqual from 'lodash/isEqual';
import crudTranslations from './i18n';
import notificationsMiddleware from './middleware/notifications';
import appStateChangeDetect from './middleware/appStateChangeDetect';

import Main from './components/Main';
import getReducer from './rootReducer';
import rootSaga from './rootSaga';

import { DEFAULT_VIEW } from './common/constants';

import {
  storeState2appState,
  fillDefaults,
  getModelPrefix,
  applyPrefixToTranslations
} from './utils';

const appName = 'crudEditor';

export default baseModelDefinition => {
  const modelDefinition = fillDefaults(baseModelDefinition);
  let onTransition = null;
  let lastState = {};

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
      i18n: PropTypes.object.isRequired // important
    };

    static childContextTypes = {
      i18n: PropTypes.object,
      uniquePrefix: PropTypes.string
    }

    static defaultProps = {
      locale: 'en',
      fallbackLocale: 'en'
    };

    constructor(...args) {
      super(...args);
      onTransition = this.props.onTransition;

      // core crud translations

      this.context.i18n.register(appName, crudTranslations);

      // model translations
      const uniquePrefix = getModelPrefix(appName, modelDefinition.model.name);
      const prefixedTranslations = applyPrefixToTranslations(modelDefinition.model.translations, uniquePrefix);
      this.context.i18n.register(uniquePrefix, prefixedTranslations);

      const sagaMiddleware = createSagaMiddleware();

      this.store = createStore(
        getReducer(modelDefinition),
        (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose)(applyMiddleware(
          // XXX: ensure each middleware calls "next(action)" synchronously,
          // or else ensure that "redux-saga" is the last middleware in the call chain.
          appStateChangeDetect({
            lastState,
            onTransition,
            modelDefinition
          }),
          notificationsMiddleware(this.context),
          sagaMiddleware
        ))
      );

      this.runningSaga = sagaMiddleware.run(rootSaga, modelDefinition);
    }

    getChildContext() {
      const
        { name: modelName, translations } = modelDefinition.model,
        prefix = getModelPrefix(appName, modelName),
        modelMessageKeys = Object.keys(
          Object.keys(translations).reduce((acc, lang) => ({ ...acc, ...translations[lang] }), {})
        ),
        i18nSource = this.context.i18n;

      return {
        i18n: {
          // this method mimics @opuscapita/i18n getMessage
          get getMessage() {
            return (key, payload) => i18nSource.getMessage(
              modelMessageKeys.indexOf(key) > -1 ? `${prefix}.${key}` : key, payload
            )
          },
          // crudEditor-specific method, used to get model tabs, sections, fields names
          get getModelMessage() {
            return type => // 'field', 'section', 'tab', or any other model message key
              key => { // name of a mathing type, can be empty for not structured keys
                const msgKey = `${prefix}.model.${type}` + (key ? `.${key}` : '');
                const i18nText = this.getMessage(msgKey);
                // if @opuscapita/i18n doesn't find a message by key, it returns the key itself
                // in this case we'are trying to make a readable title-case message
                return i18nText === msgKey ?
                  key.charAt(0).toUpperCase() + key.slice(1).replace(/[^A-Z](?=[A-Z])/g, '$&\u00A0') :
                  i18nText;
              }
          },
          // preserve all @opuscapita/i18n methods for possible usage in components, etc.
          ...Object.getOwnPropertyNames(i18nSource).
            filter(prop => typeof i18nSource[prop] === 'function' && prop !== 'getMessage').
            reduce((funcs, funcName) => ({
              ...funcs,
              [funcName]: (...args) => i18nSource[funcName](...args)
            }), {})
        }
      }
    }

    componentWillReceiveProps(props) {
      onTransition = props.onTransition;
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
        />
      </Provider>)
  }

  return CrudWrapper
};
