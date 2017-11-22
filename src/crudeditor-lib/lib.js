import cloneDeep from 'lodash/cloneDeep';

import { getViewState as getSearchViewState, getUi as getSearchUi } from './views/search';
import { getViewState as getCreateViewState, getUi as getCreateUi } from './views/create';
import { getViewState as getEditViewState, getUi as getEditUi } from './views/edit';
import { getViewState as getShowViewState, getUi as getShowUi } from './views/show';
import { getViewState as getErrorViewState } from './views/error';

import {
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

export const storeState2appState = (storeState, modelDefinition) => ({
  name: storeState.common.activeViewName,
  state: cloneDeep(getViewState[storeState.common.activeViewName](storeState, modelDefinition))
});

export function getPrefixedTranslations(translations, prefix) {
  return Object.keys(translations).
    reduce((acc, lang) => ({
      ...acc,
      [lang]: Object.keys(translations[lang]).
        reduce((acc, msgKey) => ({
          ...acc,
          [`${prefix}.${msgKey}`]: translations[lang][msgKey]
        }), {})
    }), {})
}

export function fillDefaults(baseModelDefinition) {
  // Filling modelDefinition with default values where necessary.
  const modelDefinition = cloneDeep(baseModelDefinition);
  const { model: { fields: fieldsMeta }, permissions } = modelDefinition;

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

  if (!permissions || !permissions.crudOperations) { // TODO remove after we create a proper model validator
    console.error('permissions.crudOperations must be defined in a crud schema!' + '\nExample: ' + JSON.stringify({
      model: {},
      api: {},
      ui: {},
      permissions: {
        crudOperations: {
          create: true,
          edit: true,
          delete: false,
          view: true
        }
      }
    }), null, 2);
    throw new Error('permissions.crudOperations must be defined in a crud model!');
  }

  const ops = modelDefinition.permissions.crudOperations;

  ['create', 'edit', 'delete', 'view'].forEach(operation => {
    if (!ops.hasOwnProperty(operation)) {
      ops[operation] = false
    }
  }
  );

  const canShowUi = {
    [VIEW_CREATE]: ops.create,
    [VIEW_EDIT]: ops.edit,
    [VIEW_SEARCH]: ops.view,
    [VIEW_SHOW]: ops.view
  }

  Object.keys(getUi).forEach(viewName => {
    if (getUi[viewName] && canShowUi[viewName]) {
      modelDefinition.ui[viewName] = getUi[viewName](modelDefinition);
    }
  })

  return modelDefinition;
}
