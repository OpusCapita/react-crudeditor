import { combineReducers } from 'redux';

import common from './common/reducer';
import search from './views/search/reducer';
import create from './views/create/reducer';
import edit from './views/edit/reducer';
//import show from './views/show/reducer';
import error from './views/error/reducer';

import {
  VIEW_SEARCH,
  VIEW_CREATE,
  VIEW_EDIT,
  VIEW_SHOW,
  VIEW_ERROR
} from './common/constants';

export default entityConfiguration => combineReducers({
  common: common(entityConfiguration),
  views: combineReducers({
    [VIEW_SEARCH] : search(entityConfiguration),
    [VIEW_CREATE] : create(entityConfiguration),
    [VIEW_EDIT]   : edit(entityConfiguration),
    //[VIEW_SHOW]   : show(entityConfiguration),
    [VIEW_ERROR]  : error(entityConfiguration)
  })
});
