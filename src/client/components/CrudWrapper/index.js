import cloneDeep from 'lodash/cloneDeep';
import React from 'react';
import buildModel from '../../../models';
import createCrud from '../../../crudeditor-lib';
import { hash2obj, query2obj, suffix2arr, buildURL } from './lib';
import { constants as crudeditorConstants } from '../../../crudeditor-lib/common';

const { VIEW_EDIT } = crudeditorConstants;

function url2view({ hash, query, suffix }) {
  hash = hash2obj(hash);
  query = query2obj(query);
  suffix = suffix2arr(suffix);
  let { viewName, viewState } = hash;

  return {
    viewName,  // undefined or string with view name.
    viewState  // Object, may be empty.
  };
}

const entities2crud = {};
const transitionHandlers = {};

function handleTransition(historyPush, baseURL, { viewName, viewState }) {
  if (viewName === VIEW_EDIT && viewState.tab === 3) {
    const betterTab = Number(prompt('TAB 3 is not recommended. You may choose another one:'));

    if ([1,2].includes(betterTab)) {
      viewState = cloneDeep(viewState);
      viewState.tab = betterTab;
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
  ({ view: viewName, state: viewState }) =>
    handleTransition(historyPush, baseURL, { viewState, viewName });

export default ({
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

  if (!transitionHandlers[baseURL]) {
    transitionHandlers[baseURL] = buildTransitionHandler(push, baseURL);
  }

  if (!entities2crud[entities]) {
    const model = buildModel(entities);  // TODO: handle unknown entities name.
    entities2crud[entities] = createCrud(model);
  }

  const Crud = entities2crud[entities];

  return <Crud
    view={viewName}
    state={viewState}
    onTransition={transitionHandlers[baseURL]}
  />;
}
