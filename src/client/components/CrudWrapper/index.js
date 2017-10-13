import React from 'react';
import PropTypes from 'prop-types';
import cloneDeep from 'lodash/cloneDeep';
import buildModel from '../../../models';
import createCrud from '../../../crudeditor-lib';
import { hash2obj, buildURL } from './lib';

const VIEW_EDIT = 'edit';

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
  const view = url2view({ hash, query, suffix });

  if (!handleTransition[baseURL]) {
    handleTransition[baseURL] = buildTransitionHandler(push, baseURL);
  }

  if (!entities2crud[entities]) {
    const model = buildModel(entities);
    entities2crud[entities] = createCrud(model);
  }

  const Crud = entities2crud[entities];
  return <Crud view={view} onTransition={handleTransition[baseURL]} />;
}

CrudWrapper.propTypes = {
  history: PropTypes.object,
  match: PropTypes.object
}

export default CrudWrapper;
