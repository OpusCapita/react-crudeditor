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
  let count;

  try {
    let errors;

    ({ count, errors } = yield call(modelDefinition.api.delete, { // eslint-disable-line prefer-const
      instances: instances.map(logicalKeyBuilder)
    }));

    if (count < instances.length) {
      // "errors" is optional for modelDefinition.api.delete() return object, even in case of partial/full failure.
      throw errors || [];
    }
  } catch (err) { // At least some of the requested instances have not been deleted.
    yield put({
      type: INSTANCES_DELETE_FAIL,
      payload: {
        errors: Array.isArray(err) ? err : [err],
        ...(count !== undefined && {
          count: instances.length - count, // Number of requested instances failed to be deleted.
        })
      },
      error: true,
      meta
    });

    if (count === 0) { // None of the requested instances have been deleted.
      throw err;
    }
  }

  // At least some of the requested instances have been deleted.

  yield put({
    type: INSTANCES_DELETE_SUCCESS,
    payload: {
      count,

      // Actually deleted instances are known only when all instances requested for deletion where deleted.
      ...(count === instances.length && { instances })
    },
    meta
  });
}
