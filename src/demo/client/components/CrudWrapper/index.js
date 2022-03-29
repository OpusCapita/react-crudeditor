import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cloneDeep from 'lodash/cloneDeep';
import buildModel from '../../../models';
import createCrud from '../../../../crudeditor-lib';
import { hash2obj, buildURL } from './lib';
import { I18nManager } from '@opuscapita/i18n';

const VIEW_EDIT = 'edit';
const VIEW_CREATE = 'create';

const url2view = ({ hash }) => hash2obj(hash);

const entities2crud = {};
const handleTransition = {};

function transitionHandler(historyPush, baseURL, view) {
  const modifiedView = cloneDeep(view || {});

  if (
    modifiedView.name === VIEW_EDIT &&
    modifiedView.state &&
    typeof modifiedView.state === 'object' &&
    modifiedView.state.tab === 'customer'
  ) {
    const betterTab = prompt('TAB "Customer" is not recommended. You may choose another one:');

    if (betterTab) {
      modifiedView.state.tab = betterTab.toLowerCase();
    }
  }

  historyPush(buildURL({
    base: baseURL,
    hash: modifiedView
  }));
}

const buildTransitionHandler = (historyPush, baseURL) => view => transitionHandler(historyPush, baseURL, view)

export default class CrudWrapper extends PureComponent {
  static propTypes = {
    history: PropTypes.object,
    match: PropTypes.object
  }

  static childContextTypes = {
    i18n: PropTypes.object
  }

  constructor(...args) {
    super(...args);

    this.i18n = new I18nManager();
  }

  getChildContext() {
    return {
      i18n: this.i18n
    }
  }

  render() {
    const {
      history: {
        push
      },
      location: {
        hash,
        pathname,
        search: query
      },
      match: {
        params: {
          entities
        },
        url: baseURL
      }
    } = this.props;

    if (pathname.indexOf(baseURL) !== 0) {
      throw new Error(`Router match.url "${baseURL}" is expected to be a prefix of location.pathname "${pathname}"`);
    }

    const suffix = pathname.slice(baseURL.length);
    const view = url2view({ hash, query, suffix });

    if (!handleTransition[baseURL]) {
      handleTransition[baseURL] = buildTransitionHandler(push, baseURL);
    }

    if (!entities2crud[entities]) {
      const model = buildModel(entities);
      entities2crud[entities] = createCrud(model);
    }

    const Crud = entities2crud[entities];

    return (
      <Crud
        view={view}
        onTransition={handleTransition[baseURL]}
        externalOperations={instance => [{
          handler() {
            window.location = 'http://opuscapita.com';
          },
          ui({ name: viewName, state: viewState }) {
            return {
              title: () => 'Test link',
              icon: 'link',
              dropdown: viewName !== VIEW_CREATE
            };
          }
        }, {
          handler() {
            console.log('another link handler');
            console.log(instance)
          },
          ui({ name: viewName, state: viewState }) {
            return {
              title: () => 'Another link',
              icon: 'send',
              dropdown: true
            };
          }
        }]}
        customBulkOperations={[{
          handler(instances) {
            console.log(instances);
          },
          ui({ instances }) {
            return {
              title: 'Print debug (' + instances.length + ')',
            }
          }
        }]}
        uiConfig={{
          headerLevel: 2
        }}
      />
    );
  }
}
