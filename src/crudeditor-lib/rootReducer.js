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

export default modelDefinition => {
  const { crudOperations } = modelDefinition.permissions;

  const viewReducers = {
    ...(crudOperations.view ? { [VIEW_SEARCH]: search(modelDefinition) } : null),
    ...(crudOperations.create ? { [VIEW_CREATE]: create(modelDefinition) } : null),
    ...(crudOperations.edit ? { [VIEW_EDIT]: edit(modelDefinition) } : null),
    ...(crudOperations.view ? { [VIEW_SHOW]: show(modelDefinition) } : null),
    [VIEW_ERROR]: error(modelDefinition)
  }

  return combineReducers({
    common: common(modelDefinition),
    views: combineReducers(viewReducers)
  });
}
