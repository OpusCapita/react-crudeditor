import { call, put } from 'redux-saga/effects';

import {
  INSTANCE_EDIT_FAIL,
  INSTANCE_EDIT_REQUEST,
  INSTANCE_EDIT_SUCCESS
} from '../constants';

/*
 * XXX: in case of failure, a worker saga must dispatch an appropriate action and exit by throwing an error.
 */
export default function*({
  modelDefinition,
  action: {
    payload: { instance },
    meta
  }
}) {
  yield put({
    type: INSTANCE_EDIT_REQUEST,
    meta
  });

  try {
    instance = yield call(modelDefinition.api.get, { instance });
  } catch (err) {
    yield put({
      type: INSTANCE_EDIT_FAIL,
      payload: err,
      error: true,
      meta
    });

    throw err;
  }

  yield put({
    type: INSTANCE_EDIT_SUCCESS,
    payload: { instance },
    meta
  });
}
