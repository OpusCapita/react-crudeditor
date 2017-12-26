import { call, put } from 'redux-saga/effects';

import { getLogicalKeyBuilder } from '../../lib';

import {
  INSTANCE_SHOW_FAIL,
  INSTANCE_SHOW_REQUEST,
  INSTANCE_SHOW_SUCCESS
} from '../constants';

/* //
 * XXX: in case of failure, a worker saga must dispatch an appropriate action and exit by throwing error(s).
 */
export default function*({
  modelDefinition,
  action: {
    payload: {
      instance,
      offset
    },
    meta
  }
}) {
  yield put({
    type: INSTANCE_SHOW_REQUEST,
    meta
  });

  let persistentInstance;

  try {
    persistentInstance = yield call(modelDefinition.api.get, {
      instance: getLogicalKeyBuilder(modelDefinition.model.fields)(instance)
    });
  } catch (err) {
    yield put({
      type: INSTANCE_SHOW_FAIL,
      payload: err,
      error: true,
      meta
    });

    throw err;
  }

  yield put({
    type: INSTANCE_SHOW_SUCCESS,
    payload: {
      instance: persistentInstance,
      offset
    },
    meta
  });
}
