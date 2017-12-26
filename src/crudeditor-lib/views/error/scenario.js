import { call, cancelled, put, spawn } from 'redux-saga/effects';

import { VIEW_NAME } from './constants';
import { VIEW_SOFT_REDIRECT } from '../../common/constants';
import redirectSaga from '../../common/workerSagas/redirect';
import scenarioSaga from '../../common/scenario';

import {
  VIEW_INITIALIZE,
  VIEW_REDIRECT_SUCCESS
} from './constants';

const transitions = {
  blocking: {},
  nonBlocking: {
    [VIEW_SOFT_REDIRECT]: redirectSaga
  }
};

// See Search View scenario for detailed description of the saga.
export default function*({
  modelDefinition,
  softRedirectSaga,
  viewState: err,
  source
}) {
  yield put({
    type: VIEW_INITIALIZE,
    payload: err,
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
