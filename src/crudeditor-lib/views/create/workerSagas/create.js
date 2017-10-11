import { put } from 'redux-saga/effects';

import {
  // INSTANCE_CREATE_FAIL,
  // INSTANCE_CREATE_REQUEST,
  INSTANCE_CREATE_SUCCESS
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
  // yield put({
  //   type: INSTANCE_CREATE_REQUEST,
  //   meta
  // });

  yield put({
    type: INSTANCE_CREATE_SUCCESS,
    payload: { instance },
    meta
  });
}
