import { call, put } from 'redux-saga/effects';

import {
  INSTANCE_EDIT_FAIL,
  INSTANCE_EDIT_REQUEST,
  INSTANCE_EDIT_SUCCESS
} from '../constants';

/*
 * XXX: in case of failure, a worker saga must dispatch an appropriate action and exit by throwing error(s).
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
    const persistentInstance = yield call(modelDefinition.api.get, { instance });

    yield put({
      type: INSTANCE_EDIT_SUCCESS,
      payload: {
        instance: persistentInstance
      },
      meta
    });
  } catch (errors) {
    yield put({
      type: INSTANCE_EDIT_FAIL,
      payload: errors,
      error: true,
      meta
    });

    throw errors;
  }
}
