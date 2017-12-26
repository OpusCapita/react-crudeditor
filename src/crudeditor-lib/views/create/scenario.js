import { call, cancelled, put, spawn } from 'redux-saga/effects';

import saveSaga from './workerSagas/save';
import redirectSaga from '../../common/workerSagas/redirect';
import { VIEW_SOFT_REDIRECT } from '../../common/constants';
import scenarioSaga from '../../common/scenario';

import {
  INSTANCE_SAVE,
  VIEW_INITIALIZE,
  VIEW_REDIRECT_SUCCESS,
  VIEW_NAME
} from './constants';

const transitions = {
  blocking: {
    [INSTANCE_SAVE]: saveSaga
  },
  nonBlocking: {
    [VIEW_SOFT_REDIRECT]: redirectSaga
  }
}

// See Search View scenario for detailed description of the saga.
export default function*({
  modelDefinition,
  softRedirectSaga,
  viewState: {
    predefinedFields = {}
  },
  source
}) {
  yield put({
    type: VIEW_INITIALIZE,
    payload: { predefinedFields },
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
