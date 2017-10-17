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
  views: combineReducers({
    [VIEW_SEARCH]: search(modelDefinition),
    [VIEW_CREATE]: create(modelDefinition),
    [VIEW_EDIT]: edit(modelDefinition),
    [VIEW_SHOW]: show(modelDefinition),
    [VIEW_ERROR]: error(modelDefinition)
  })
});
