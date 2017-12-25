import { call, cancelled, put, spawn } from 'redux-saga/effects';

import showSaga from './workerSagas/show';
import showAdjacentSaga from './workerSagas/showAdjacent';
import redirectSaga from '../../common/workerSagas/redirect';
import scenarioSaga from '../../common/scenario';
import { VIEW_SOFT_REDIRECT } from '../../common/constants';

import {
  TAB_SELECT,
  VIEW_INITIALIZE_REQUEST,
  VIEW_INITIALIZE_FAIL,
  VIEW_INITIALIZE_SUCCESS,
  VIEW_REDIRECT_SUCCESS,
  ADJACENT_INSTANCE_SHOW,
  VIEW_NAME
} from './constants';

const transitions = {
  blocking: {},
  nonBlocking: {
    [ADJACENT_INSTANCE_SHOW]: showAdjacentSaga,
    [VIEW_SOFT_REDIRECT]: redirectSaga
  }
};

// See Search View scenario for detailed description of the saga.
export default function*({
  modelDefinition,
  softRedirectSaga,
  viewState: {
    instance,
    tab: tabName
  },
  offset,
  source
}) {
  yield put({
    type: VIEW_INITIALIZE_REQUEST,
    meta: { source }
  });

  try {
    yield call(showSaga, {
      modelDefinition,
      action: {
        payload: {
          instance,
          offset
        },
        meta: { source }
      }
    });
  } catch (err) {
    yield put({
      type: VIEW_INITIALIZE_FAIL,
      payload: err,
      error: true,
      meta: { source }
    });

    throw err; // Initialization error(s) are forwarded to the parent saga.
  }

  yield put({
    type: TAB_SELECT,
    payload: { tabName },
    meta: { source }
  });

  yield put({
    type: VIEW_INITIALIZE_SUCCESS,
    meta: { source }
  });

  return (yield spawn(function*() {
    try {
      yield call(scenarioSaga, {
        modelDefinition,
        softRedirectSaga,
        transitions,
        viewName: VIEW_NAME
      });
    } finally {
      if (yield cancelled()) {
        yield put({
          type: VIEW_REDIRECT_SUCCESS
        });
      }
    }
  }));
}
