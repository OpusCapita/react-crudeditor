import cloneDeep from 'lodash/cloneDeep';

import { checkModelDefinition } from './check-model';

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
  VIEW_ERROR,

  PERMISSION_CREATE,
  PERMISSION_EDIT,
  PERMISSION_VIEW,
  PERMISSION_DELETE
} from './common/constants';

const getViewState = {
  [VIEW_SEARCH]: getSearchViewState,
  [VIEW_CREATE]: getCreateViewState,
  [VIEW_EDIT]: getEditViewState,
  [VIEW_SHOW]: getShowViewState,
  [VIEW_ERROR]: getErrorViewState
};

// see npm "bounce" module for details: https://github.com/hapijs/bounce
export const isSystemError = err => [
  EvalError,
  RangeError,
  ReferenceError,
  SyntaxError,
  TypeError,
  URIError
].some(systemErrorConstructor => err instanceof systemErrorConstructor);

export const storeState2appState = (storeState, modelDefinition) => storeState.common.activeViewName ?
  {
    name: storeState.common.activeViewName,
    state: cloneDeep(getViewState[storeState.common.activeViewName](storeState, modelDefinition))
  } :
  undefined;

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

/**
 * Function 'isAllowed' returns permission for certain operation
 * @param {{ view: <bool|func>, create: <bool|func>, delete: <bool|func>, edit: <bool|func> }} permissions
 * @param {string} operation - one of 'view', 'create', `edit`, 'delete'
 * @param {undefined|object} data - arg for permissions function, e.g. { instance } for per-instance permissions
 * @returns {boolean}
 */
export function isAllowed(permissions, operation, data) { // eslint-disable-line consistent-return
  if (permissions[operation] instanceof Function) {
    return arguments.length === 3 ?
      // global permission is enforced before checking data
      permissions[operation]() && permissions[operation](data) :
      permissions[operation]()
  }
  return permissions[operation]
}

// Filling modelDefinition with default values where necessary.
export function fillDefaults(baseModelDefinition) {
  const modelDefinition = cloneDeep(baseModelDefinition);

  // validate modelDefinition using 'prop-types'
  checkModelDefinition(modelDefinition);

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

  if (!modelDefinition.ui.customOperations) {
    modelDefinition.ui.customOperations = _ => [];
  }

  const { crudOperations } = modelDefinition.permissions;

  [PERMISSION_CREATE, PERMISSION_EDIT, PERMISSION_VIEW, PERMISSION_DELETE].
    filter(p => !crudOperations.hasOwnProperty(p)).
    forEach(p => {
      crudOperations[p] = false
    });


  const getUi = {
    ...(isAllowed(crudOperations, PERMISSION_VIEW) ? { [VIEW_SEARCH]: getSearchUi } : null),
    ...(isAllowed(crudOperations, PERMISSION_CREATE) ? { [VIEW_CREATE]: getCreateUi } : null),
    ...(isAllowed(crudOperations, PERMISSION_EDIT) ? { [VIEW_EDIT]: getEditUi } : null),
    ...(isAllowed(crudOperations, PERMISSION_VIEW) ? { [VIEW_SHOW]: getShowUi } : null)
  };

  Object.keys(getUi).forEach(viewName => {
    if (getUi[viewName]) {
      modelDefinition.ui[viewName] = getUi[viewName](modelDefinition);
    }
  });

  return modelDefinition;
}
