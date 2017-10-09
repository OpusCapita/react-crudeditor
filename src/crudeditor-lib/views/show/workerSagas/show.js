import { call, put } from 'redux-saga/effects';

import {
  INSTANCE_SHOW_FAIL,
  INSTANCE_SHOW_REQUEST,
  INSTANCE_SHOW_SUCCESS
} from '../constants';

/* //
 * XXX: in case of failure, a worker saga must dispatch an appropriate action and exit by throwing an error.
 */
export default function*({
  modelDefinition,
  action: {
    payload: { instance },
    meta: { source } = {}
  }
}) {
  yield put({
    type: INSTANCE_SHOW_REQUEST,
    meta: { source }
  });

  try {
    instance = yield call(modelDefinition.api.get, { instance });
  } catch (err) {
    yield put({
      type: INSTANCE_SHOW_FAIL,
      payload: err,
      error: true,
      meta: { source }
    });

    throw err;
  }

  yield put({
    type: INSTANCE_SHOW_SUCCESS,
    payload: { instance },
    meta: { source }
  });
}
