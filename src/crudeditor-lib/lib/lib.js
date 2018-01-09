import cloneDeep from 'lodash/cloneDeep';
import { checkModelDefinition } from './object-validation';
import {
  DEFAULT_FIELD_TYPE,
  VIEW_SEARCH,
  VIEW_CREATE,
  VIEW_EDIT,
  VIEW_SHOW,
  VIEW_ERROR,

  PERMISSION_CREATE,
  PERMISSION_DELETE,
  PERMISSION_EDIT,
  PERMISSION_VIEW
} from '../common/constants';

import { getViewState as getSearchViewState, getUi as getSearchUi } from '../views/search';
import { getViewState as getCreateViewState, getUi as getCreateUi } from '../views/create';
import { getViewState as getEditViewState, getUi as getEditUi } from '../views/edit';
import { getViewState as getShowViewState, getUi as getShowUi } from '../views/show';
import { getViewState as getErrorViewState } from '../views/error';

const getViewState = {
  [VIEW_SEARCH]: getSearchViewState,
  [VIEW_CREATE]: getCreateViewState,
  [VIEW_EDIT]: getEditViewState,
  [VIEW_SHOW]: getShowViewState,
  [VIEW_ERROR]: getErrorViewState
};

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

  const { crudOperations } = modelDefinition.permissions;

  [
    PERMISSION_CREATE,
    PERMISSION_EDIT,
    PERMISSION_DELETE,
    PERMISSION_VIEW
  ].forEach(operationPermission => {
    if (!crudOperations.hasOwnProperty(operationPermission)) {
      crudOperations[operationPermission] = false
    }
  });

  if (!modelDefinition.ui.operations) {
    modelDefinition.ui.operations = _ => [];
  }

  const getUi = {
    ...(crudOperations.view ? { [VIEW_SEARCH]: getSearchUi } : null),
    ...(crudOperations.create ? { [VIEW_CREATE]: getCreateUi } : null),
    ...(crudOperations.edit ? { [VIEW_EDIT]: getEditUi } : null),
    ...(crudOperations.view ? { [VIEW_SHOW]: getShowUi } : null)
  };

  Object.keys(getUi).forEach(viewName => {
    if (getUi[viewName]) {
      modelDefinition.ui[viewName] = getUi[viewName](modelDefinition);
    }
  });

  return modelDefinition;
}
