import { call } from 'redux-saga/effects';

import deleteSaga from '../../../common/workerSagas/delete';
import searchSaga from './search';

/*
 * XXX: in case of failure, a worker saga must dispatch an appropriate action and exit by throwing error(s).
 */
export default function*({
  modelDefinition,
  softRedirectSaga,
  action: {
    payload: { instances },
    meta
  }
}) {
  // XXX: error(s) thrown in called below sagas are forwarded to the parent saga. Use try..catch to alter this default.

  yield call(deleteSaga, {
    modelDefinition,
    action: {
      payload: { instances },
      meta
    }
  });

  // Refresh search results.
  yield call(searchSaga, {
    modelDefinition,
    softRedirectSaga,
    action: {
      payload: {}
    }
  });
}
