import React from 'react';
import PropTypes from 'prop-types';
import cloneDeep from 'lodash/cloneDeep';
import buildModel from '../../../models';
import createCrud from '../../../crudeditor-lib';
import { hash2obj, buildURL } from './lib';

const VIEW_EDIT = 'edit';

function url2view({ hash }) {
  let { viewName, viewState } = hash2obj(hash);

  return {
    viewName, // undefined or string with view name.
    viewState // Object, may be empty.
  };
}

const entities2crud = {};
const handleTransition = {};

function transitionHandler(historyPush, baseURL, view) {
  let { viewName, viewState } = view;

  if (viewName === VIEW_EDIT && viewState.tab === 'customer') {
    const betterTab = prompt('TAB "Customer" is not recommended. You may choose another one:');

    if (betterTab) {
      viewState = cloneDeep(viewState);
      viewState.tab = betterTab.toLowerCase();
    }
  }

  historyPush(buildURL({
    base: baseURL,
    hash: {
      viewName,
      viewState
    }
  }));
}

const buildTransitionHandler = (historyPush, baseURL) =>
  ({ name: viewName, state: viewState }) =>
    transitionHandler(historyPush, baseURL, { viewState, viewName });

const CrudWrapper = ({
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
}) => {
  if (pathname.indexOf(baseURL) !== 0) {
    throw new Error(`Router match.url "${baseURL}" is exptected to be a prefix of location.pathname "${pathname}"`);
  }

  const suffix = pathname.slice(baseURL.length);
  const { viewName, viewState } = url2view({ hash, query, suffix });

  if (!handleTransition[baseURL]) {
    handleTransition[baseURL] = buildTransitionHandler(push, baseURL);
  }

  if (!entities2crud[entities]) {
    const model = buildModel(entities); // TODO: handle unknown entities name. TBD entities?
    entities2crud[entities] = createCrud(model);
  }

  const Crud = entities2crud[entities];
  return <Crud view={{ name: viewName, state: viewState }} onTransition={handleTransition[baseURL]} />;
}

CrudWrapper.propTypes = {
  history: PropTypes.object,
  match: PropTypes.object
}

export default CrudWrapper;
