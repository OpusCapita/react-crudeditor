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
    payload: {
      instance,
      navigation
    },
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

  console.log({
    type: INSTANCE_EDIT_SUCCESS,
    payload: {
      instance: persistentInstance,
      ...(navigation ?
        {
          nextInstanceExists: navigation.offset < navigation.totalCount - 1,
          prevInstanceExists: navigation.offset > 0 && navigation.totalCount > 0,
          error: navigation.error
        } :
        {}
      )
    },
    meta,
    navigation
  })

  yield put({
    type: INSTANCE_EDIT_SUCCESS,
    payload: {
      instance: persistentInstance,
      ...(navigation ?
        {
          nextInstanceExists: navigation.offset < navigation.totalCount - 1,
          prevInstanceExists: navigation.offset > 0 && navigation.totalCount > 0,
          error: navigation.error
        } :
        {}
      )
    },
    meta
  });
}
