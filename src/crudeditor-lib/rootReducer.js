import { combineReducers } from 'redux';

import common from './common/reducer';
import search from './views/search/reducer';
import create from './views/create/reducer';
import edit from './views/edit/reducer';
import show from './views/show/reducer';
import error from './views/error/reducer';

import {
  VIEW_SEARCH,
  VIEW_CREATE,
  VIEW_EDIT,
  VIEW_SHOW,
  VIEW_ERROR
} from './common/constants';

export default /* istanbul ignore next */ (modelDefinition, i18n) => {
  const permissions = modelDefinition.permissions.crudOperations;

  const viewReducers = {
    ...(permissions.view ? { [VIEW_SEARCH]: search(modelDefinition, i18n) } : null),
    ...(permissions.create ? { [VIEW_CREATE]: create(modelDefinition, i18n) } : null),
    ...(permissions.edit ? { [VIEW_EDIT]: edit(modelDefinition, i18n) } : null),
    ...(permissions.view ? { [VIEW_SHOW]: show(modelDefinition, i18n) } : null),
    [VIEW_ERROR]: error(modelDefinition, i18n)
  }

  return combineReducers({
    common: common(modelDefinition, i18n),
    views: combineReducers(viewReducers)
  });
}
