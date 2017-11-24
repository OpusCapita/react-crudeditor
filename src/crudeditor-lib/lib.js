import cloneDeep from 'lodash/cloneDeep';
import PropTypes from 'prop-types';

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

// https://stackoverflow.com/a/31169012
const allPropTypes = (...types) => (...args) => {
  const errors = types.map((type) => type(...args)).filter(Boolean);
  if (errors.length === 0) {
    return
  };
  return new Error(errors.map((e) => e.message).join('\n'));
};

const modelPropTypes = {
  model: PropTypes.shape({
    name: PropTypes.string.isRequired,
    fields: allPropTypes(
      PropTypes.objectOf(PropTypes.shape({
        unique: PropTypes.bool,
        type: PropTypes.string,
        constraints: PropTypes.shape({
          max: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.instanceOf(Date)
          ]),
          min: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.instanceOf(Date)
          ]),
          required: PropTypes.bool,
          email: PropTypes.bool,
          matches: PropTypes.instanceOf(RegExp),
          url: PropTypes.bool,
          validate: PropTypes.func
        })
      })).isRequired,
      (props, propName, componentName) => {
        if (!props[propName]) {
          return; // don't duplicate an Error because it'll be returned by 'isRequired' above
        }
        const noUniqueFields = Object.keys(props[propName]).
          filter(fieldName => props[propName][fieldName].unique).length === 0;

        if (noUniqueFields) {
          return new Error(`${componentName}: At least one field should have property 'unique: true'.`);
        }
      }
    ),
    validate: PropTypes.func.isRequired
  }).isRequired,
  permissions: PropTypes.shape({
    crudOperations: PropTypes.shape({
      create: PropTypes.bool,
      edit: PropTypes.bool,
      delete: PropTypes.bool,
      view: PropTypes.bool
    }).isRequired
  }).isRequired,
  api: PropTypes.shape({
    get: PropTypes.func.isRequired,
    search: PropTypes.func.isRequired,
    delete: PropTypes.func.isRequired,
    create: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired
  }).isRequired,
  ui: PropTypes.shape({
    Spinner: PropTypes.func,
    search: PropTypes.func,
    instanceLabel: PropTypes.func,
    create: PropTypes.shape({
      defaultNewInstance: PropTypes.func,
      formLayout: PropTypes.func
    }),
    edit: PropTypes.shape({
      formLayout: PropTypes.func
    }),
    show: PropTypes.shape({
      formLayout: PropTypes.func
    }),
    customViews: PropTypes.objectOf(PropTypes.func),
    operations: PropTypes.func
  })
};

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

// Filling modelDefinition with default values where necessary.
export function fillDefaults(baseModelDefinition) {
  const modelDefinition = cloneDeep(baseModelDefinition);

  // validate modelDefinition using 'prop-types'
  PropTypes.checkPropTypes(modelPropTypes, modelDefinition, 'property', 'React-CrudEditor Model');

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

  ['create', 'edit', 'delete', 'view'].forEach(operation => {
    if (!crudOperations.hasOwnProperty(operation)) {
      crudOperations[operation] = false
    }
  });

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
