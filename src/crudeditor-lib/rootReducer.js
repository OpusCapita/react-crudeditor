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

export default modelDefinition => combineReducers({
  common: common(modelDefinition),
  views: combineReducers(
    (ops => ({
      ...(ops.view ? { [VIEW_SEARCH]: search(modelDefinition) } : null),
      ...(ops.create ? { [VIEW_CREATE]: create(modelDefinition) } : null),
      ...(ops.edit ? { [VIEW_EDIT]: edit(modelDefinition) } : null),
      ...(ops.view ? { [VIEW_SHOW]: show(modelDefinition) } : null),
      [VIEW_ERROR]: error(modelDefinition)
    }))(modelDefinition.permissions.crudOperations)
  )
});
