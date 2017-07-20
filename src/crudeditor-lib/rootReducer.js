import { combineReducers } from 'redux';

import common from './common/reducer';
import { constants as commonConstants } from './common';
import search from './views/search';
import create from './views/create';
import edit from './views/edit';
//import show from './views/show';
import error from './views/error';

const {
  VIEW_SEARCH,
  VIEW_CREATE,
  VIEW_EDIT,
  VIEW_SHOW,
  VIEW_ERROR
} = commonConstants;

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
