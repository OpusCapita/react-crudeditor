import { call, put } from 'redux-saga/effects';

import { getLogicalKeyBuilder } from '../../lib';

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
    payload: { instance, referer },
    meta
  }
}) {
  yield put({
    type: INSTANCE_EDIT_REQUEST,
    meta
  });

  let persistentInstance;

  try {
    persistentInstance = yield call(modelDefinition.api.get, {
      instance: getLogicalKeyBuilder(modelDefinition.model.fields)(instance)
    });
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
    payload: {
      instance: persistentInstance,
      referer
    },
    meta
  });
}
