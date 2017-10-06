import { call, put } from 'redux-saga/effects';

import {
  INSTANCES_DELETE_FAIL,
  INSTANCES_DELETE_REQUEST,
  INSTANCES_DELETE_SUCCESS,
} from '../constants';

/*
 * XXX: in case of failure, a worker saga must dispatch an appropriate action and exit by throwing an error.
 */
export default function*({
  modelDefinition,
  action: {
    payload: { instances },
    meta: { source } = {}
  }
}) {
  yield put({
    type: INSTANCES_DELETE_REQUEST,
    meta: { source }
  });

  try {
    const { deletedCount } = yield call(
      modelDefinition.api.delete,
      { instances }
    );

    yield put({
      type: INSTANCES_DELETE_SUCCESS,
      payload: { instances },
      meta: { source }
    });
  } catch (err) {
    yield put({
      type: INSTANCES_DELETE_FAIL,  // TODO: handle error
      payload: err,
      error: true,
      meta: { source }
    });

    throw error;
  }
}
