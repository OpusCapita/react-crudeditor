import { call, put } from 'redux-saga/effects';

import { VIEW_SHOW } from '../../../common/constants';

import {
  VIEW_REDIRECT_REQUEST,
  VIEW_REDIRECT_FAIL
} from '../constants';

/*
 * XXX: in case of failure, a worker saga must dispatch an appropriate action and exit by throwing error(s).
 */
export default function*({
  modelDefinition,
  softRedirectSaga,
  action: {
    payload: { instance },
    meta
  }
}) {
  yield put({
    type: VIEW_REDIRECT_REQUEST,
    meta
  });

  try {
    yield call(softRedirectSaga, {
      viewName: VIEW_SHOW,
      viewState: { instance }
    });
  } catch (errors) {
    yield put({
      type: VIEW_REDIRECT_FAIL,
      payload: errors,
      error: true,
      meta
    });

    throw errors;
  }
}
