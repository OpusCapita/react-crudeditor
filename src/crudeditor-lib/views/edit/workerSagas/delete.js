import { call, put } from 'redux-saga/effects';

import deleteSaga from '../../../common/workerSagas/delete';
import { VIEW_REDIRECT_REQUEST } from '../constants';

import {
  VIEW_ERROR,
  VIEW_SEARCH
} from '../../../common/constants';

/*
 * XXX: in case of failure, a worker saga must dispatch an appropriate action and exit by throwing error(s).
 */
export default function*({
  modelDefinition,
  softRedirectSaga,
  action: {
    payload: { instances },
    meta
  }
}) {
  yield call(deleteSaga, { // Forwarding thrown errors to the parent saga.
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
  } catch (errors) {
    yield call(softRedirectSaga, {
      viewName: VIEW_ERROR,
      viewState: errors
    });
  }
}
