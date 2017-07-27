import { all } from 'redux-saga/effects'

import common from './common/sagas';
import search from './views/search/sagas';
//import create from './views/create/sagas';
import edit from './views/edit/sagas';
//import show from './views/show/sagas';
//import error from './views/error/sagas';


export default function*(entityConfiguration) {
  yield all([
    common(entityConfiguration),
    search(entityConfiguration),
    //create(entityConfiguration),
    edit(entityConfiguration)
    //show(entityConfiguration),
    //error(entityConfiguration)
  ])
}
