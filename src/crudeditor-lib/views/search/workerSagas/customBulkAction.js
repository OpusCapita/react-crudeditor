import { call, put } from 'redux-saga/effects';

import searchSaga from './search';
import {
  INSTANCES_CUSTOM_ACTION_INITIALIZATION,
  INSTANCES_CUSTOM_ACTION_FINALIZATION
} from "../constants";

/*
 * XXX: in case of failure, a worker saga must dispatch an appropriate action and exit by throwing error(s).
 */
export default function*({
  modelDefinition,
  softRedirectSaga,
  action: {
    payload: { instances, customBulkOperationFunction },
    meta
  }
}) {
  // XXX: error(s) thrown in called below sagas are forwarded to the parent saga. Use try..catch to alter this default.

  yield put({
    type: INSTANCES_CUSTOM_ACTION_INITIALIZATION,
    payload: { instances, customBulkOperationFunction },
    meta
  });

  try {
    yield call(customBulkOperationFunction, { instances });
  } finally {
    yield put({
      type: INSTANCES_CUSTOM_ACTION_FINALIZATION,
      payload: { instances, customBulkOperationFunction },
      meta
    });
  }

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
