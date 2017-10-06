import { call, put } from 'redux-saga/effects';

import { VIEW_EDIT } from '../../../common/constants';

import {
  VIEW_REDIRECT_REQUEST,
  VIEW_REDIRECT_FAIL
} from '../constants';

/*
 * XXX: in case of failure, a worker saga must dispatch an appropriate action and exit by throwing an error.
 */
export default function*({
  modelDefinition,
  softRedirectSaga,
  action: {
    payload: { instance },
    meta: { source } = {}
  }
}) {
  yield put({
    type: VIEW_REDIRECT_REQUEST,
    meta: { source }
  });

  try {
    yield call(softRedirectSaga, {
      viewName: VIEW_EDIT,
      viewState: { instance }
    });
  } catch(err) {
    yield put({
      type: VIEW_REDIRECT_FAIL,
      payload: err,
      error: true,
      meta: { source }
    });

    throw err;
  }
}
