import { put } from 'redux-saga/effects';

import {
  // INSTANCE_CREATE_FAIL,
  INSTANCE_CREATE_REQUEST,
  INSTANCE_CREATE_SUCCESS
} from '../constants';

/*
 * XXX: in case of failure, a worker saga must dispatch an appropriate action and exit by throwing error(s).
 */
export default function*({
  modelDefinition,
  action: {
    meta
  }
}) {
  yield put({
    type: INSTANCE_CREATE_REQUEST,
    meta
  });

  // try {
  //   instance = yield call(modelDefinition.api.get, { instance });
  // } catch (errors) {
  //   yield put({
  //     type: INSTANCE_CREATE_FAIL,
  //     payload: errors,
  //     error: true,
  //     meta
  //   });

  //   throw errors;
  // }

  yield put({
    type: INSTANCE_CREATE_SUCCESS,
    meta
  });
}
