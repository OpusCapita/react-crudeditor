import { call, put, select } from 'redux-saga/effects';

import {
  INSTANCES_DELETE_FAIL,
  INSTANCES_DELETE_REQUEST,
  INSTANCES_DELETE_SUCCESS,
} from './constants';

/*
 * XXX: in case of failure, a worker saga must dispatch an appropriate action and exit by throwing an error.
 */
export default function*(modelDefinition, instances) {
  yield put({
    type: INSTANCES_DELETE_REQUEST
  });

  try {
    const { deletedCount } = yield call(
      modelDefinition.api.delete,
      { instances }
    );

    yield put({
      type: INSTANCES_DELETE_SUCCESS,
      payload: { instances }
    });
  } catch (err) {
    yield put({
      type: INSTANCES_DELETE_FAIL,  // TODO: handle error
      payload: err,
      error: true
    });

    throw error;
  }
}
