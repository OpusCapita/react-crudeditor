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

function missingObjKeys(obj, requiredKeys) {
  return requiredKeys.filter(key => Object.keys(obj).indexOf(key) === -1)
}

function validateModelDefinition(modelDefinition) {
  const errorPrefix = 'Crud Model definition error: ';

  if (typeof modelDefinition !== 'object') {
    throw new Error(`${errorPrefix}Model definition must be an object.`)
  }

  // TODO add required keys (custom operations, etc.) as they're implemented
  const rootKeys = ['model', 'permissions', 'api', 'ui'];
  const missingRootKeys = missingObjKeys(modelDefinition, rootKeys);

  if (missingRootKeys.length) {
    throw new Error(`${errorPrefix}Model definition is missing required properties: ${missingRootKeys.join(', ')}.`);
  }

  const { model, permissions, api, ui } = modelDefinition;

  // MODEL

  if (!model.fields || typeof model.fields !== 'object') {
    throw new Error(`${errorPrefix}Model must contain 'fields' object.`);
  }

  if (!model.validate || typeof model.validate !== 'function') {
    throw new Error(`${errorPrefix}Model must contain 'validate' function. Signature: (instance) => boolean.`);
  }

  // PERMISSIONS

  if (!permissions.crudOperations) {
    throw new Error(`
      ${errorPrefix}'permissions' must contain 'crudOperations' object.
      Example: ${JSON.stringify({ create: true, edit: true, delete: false, view: true })}.
      (Hint: not defined operations are considered forbidden.)
    `);
  }

  if (!permissions.crudOperations.view) { // TBD it this ok?
    console.warn(`Search page is unavailable if 'view' is set to false or undefined in model's permissions.crudOperations.`)
  }

  // API

  const missingApiKeys = missingObjKeys(api, ['get', 'search', 'create', 'delete', 'update']);

  if (missingApiKeys.length) {
    throw new Error(`${errorPrefix}'api' object is missing required properties: ${missingApiKeys.join(', ')}.`);
  }

  // UI

  if (ui.search && typeof ui.search !== 'function') {
    throw new Error(`${errorPrefix}ui.search must be a function.`);
  }

  ['edit', 'create', 'show'].forEach(viewName => {
    if (ui[viewName] && (!ui[viewName].formLayout || typeof ui[viewName].formLayout !== 'function')) {
      throw new Error(`${errorPrefix}ui.${viewName} must have a 'formLayout' function.`);
    }
  })

  if (ui.instanceLabel && typeof ui.instanceLabel !== 'function') {
    throw new Error(`${errorPrefix}ui.instanceLabel must be a function.`);
  }

  if (ui.Spinner && typeof ui.Spinner !== 'function') {
    throw new Error(`${errorPrefix}ui.Spinner must be a function.`);
  }
}

export const storeState2appState = (storeState, modelDefinition) => {
  const getViewState = {
    [VIEW_SEARCH]: getSearchViewState,
    [VIEW_CREATE]: getCreateViewState,
    [VIEW_EDIT]: getEditViewState,
    [VIEW_SHOW]: getShowViewState,
    [VIEW_ERROR]: getErrorViewState
  };

  return {
    name: storeState.common.activeViewName,
    state: cloneDeep(getViewState[storeState.common.activeViewName](storeState, modelDefinition))
  }
};

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

  // throws in case of failed validation; silent otherwise
  validateModelDefinition(modelDefinition);

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

  const allowedOps = modelDefinition.permissions.crudOperations;

  ['create', 'edit', 'delete', 'view'].forEach(operation => {
    if (!allowedOps.hasOwnProperty(operation)) {
      allowedOps[operation] = false
    }
  }
  );

  const getUi = {
    ...(allowedOps.view ? { [VIEW_SEARCH]: getSearchUi } : null),
    ...(allowedOps.create ? { [VIEW_CREATE]: getCreateUi } : null),
    ...(allowedOps.edit ? { [VIEW_EDIT]: getEditUi } : null),
    ...(allowedOps.view ? { [VIEW_SHOW]: getShowUi } : null)
  };

  Object.keys(getUi).forEach(viewName => {
    if (getUi[viewName]) {
      modelDefinition.ui[viewName] = getUi[viewName](modelDefinition);
    }
  })

  return modelDefinition;
}