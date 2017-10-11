import { call, put } from 'redux-saga/effects';
import { getLogicalKeyBuilder } from '../../views/lib';

import {
  INSTANCES_DELETE_FAIL,
  INSTANCES_DELETE_REQUEST,
  INSTANCES_DELETE_SUCCESS,
} from '../constants';

/*
 * XXX: in case of failure, a worker saga must dispatch an appropriate action and exit by throwing error(s).
 */
export default function*({
  modelDefinition,
  action: {
    payload: { instances },
    meta
  }
}) {
  yield put({
    type: INSTANCES_DELETE_REQUEST,
    meta
  });

  const logicalKeyBuilder = getLogicalKeyBuilder(modelDefinition.model.fields);

  try {
    yield call(modelDefinition.api.delete, {
      instances: instances.map(logicalKeyBuilder)
    });
  } catch (err) {
    yield put({
      type: INSTANCES_DELETE_FAIL,
      payload: err,
      error: true,
      meta
    });

    throw err;
  }

  yield put({
    type: INSTANCES_DELETE_SUCCESS,
    payload: { instances },
    meta
  });
}
