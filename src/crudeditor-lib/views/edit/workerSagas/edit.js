import { call, put, select } from 'redux-saga/effects';

import {
  INSTANCE_EDIT_FAIL,
  INSTANCE_EDIT_REQUEST,
  INSTANCE_EDIT_SUCCESS,
  VIEW_NAME
} from './constants';

/*
 * XXX: in case of failure, a worker saga must dispatch an appropriate action and exit by throwing an error.
 */
export default function* (modelDefinition,
  payload: { instance }
) {
  yield put({
    type: INSTANCE_EDIT_REQUEST
  });

  try {
    instance = yield call(modelDefinition.api.get, { instance });

    yield put({
      type: INSTANCE_EDIT_SUCCESS,
      payload: { instance }
    });
  } catch (err) {
    yield put({
      type: INSTANCE_EDIT_FAIL,
      payload: err,
      error: true
    });

    throw err;
  }
}
