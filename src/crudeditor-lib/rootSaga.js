import { all } from 'redux-saga/effects'

import { sagas as common } from './common';
import { sagas as search } from './views/search';
//import { sagas as create } from './views/create';
import { sagas as edit   } from './views/edit';
//import { sagas as show   } from './views/show';
//import { sagas as error  } from './views/error';


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
