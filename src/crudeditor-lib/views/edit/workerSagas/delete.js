import { call, put } from 'redux-saga/effects';

import { VIEW_SEARCH } from '../../../common/constants';

import {
  VIEW_REDIRECT_REQUEST,
  VIEW_REDIRECT_FAIL
} from '../constants';

import deleteSaga from '../../../common/workerSagas/delete';
/*
 * XXX: in case of failure, a worker saga must dispatch an appropriate action and exit by throwing an error.
 */
export default function*({
  modelDefinition,
  softRedirectSaga,
  action: {
    payload: { instances },
    meta
  }
}) {
  yield call(deleteSaga, {  // Forwarding thrown errors to the parent saga.
    modelDefinition,
    action: {
      payload: { instances },
      meta
    }
  });

  yield put({
    type: VIEW_REDIRECT_REQUEST,
    meta
  });

  try {
    yield call(softRedirectSaga, {
      viewName: VIEW_SEARCH
    });
  } catch(err) {
    yield put({
      type: VIEW_REDIRECT_FAIL,
      payload: err,
      error: true,
      meta
    });

    throw err;
  }
}
