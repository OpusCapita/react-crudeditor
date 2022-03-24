import { call } from 'redux-saga/effects';

import searchSaga from './search';

/*
 * XXX: in case of failure, a worker saga must dispatch an appropriate action and exit by throwing error(s).
 */
export default function*({
  modelDefinition,
  softRedirectSaga,
  action: {
    payload: { instances, action },
    meta
  }
}) {
  // XXX: error(s) thrown in called below sagas are forwarded to the parent saga. Use try..catch to alter this default.

  console.log(instances);
  yield call(action, instances);

  // Refresh search results.
  yield call(searchSaga, {
    modelDefinition,
    softRedirectSaga,
    action: {
      payload: {},
      meta
    }
  });
}
