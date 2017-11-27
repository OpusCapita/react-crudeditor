import { take, cancel, call, fork, cancelled, put, spawn } from 'redux-saga/effects';

import exitSaga from './workerSagas/exit';
import saveSaga from './workerSagas/save';
import redirectSaga from '../../common/workerSagas/redirect';

import {
  INSTANCE_SAVE,
  VIEW_EXIT,
  VIEW_INITIALIZE,
  VIEW_REDIRECT_SUCCESS,
  VIEW_NAME
} from './constants';
import { VIEW_SOFT_REDIRECT } from '../../common/constants';

// See Search View scenarioSaga in ../search/scenario for detailed description of the saga.
function* scenarioSaga({ modelDefinition, softRedirectSaga }) {
  const choices = {
    blocking: {
      [INSTANCE_SAVE]: saveSaga
    },
    nonBlocking: {
      [VIEW_EXIT]: exitSaga,
      [VIEW_SOFT_REDIRECT]: redirectSaga
    }
  }

  let lastTask;

  while (true) {
    const action = yield take([
      ...Object.keys(choices.blocking),
      ...Object.keys(choices.nonBlocking)
    ]);

    // Automatically cancel any task started previously if it's still running.
    if (lastTask) {
      yield cancel(lastTask);
    }

    if (Object.keys(choices.blocking).indexOf(action.type) > -1) {
      try {
        yield call(choices.blocking[action.type], {
          modelDefinition,
          softRedirectSaga,
          action: {
            ...action,
            meta: {
              ...action.meta,
              spawner: VIEW_NAME
            }
          }
        });
      } catch (err) {
        // Swallow custom errors.
        if (err instanceof Error) {
          throw err;
        }
      }
    } else if (Object.keys(choices.nonBlocking).indexOf(action.type) > -1) {
      lastTask = yield fork(function*() {
        try {
          yield call(choices.nonBlocking[action.type], {
            modelDefinition,
            softRedirectSaga,
            action: {
              ...action,
              meta: {
                ...action.meta,
                spawner: VIEW_NAME
              }
            }
          });
        } catch (err) {
          // Swallow custom errors.
          if (err instanceof Error) {
            throw err;
          }
        }
      });
    }
  }
}

// See Search View scenario for detailed description of the saga.
export default function*({
  modelDefinition,
  softRedirectSaga,
  viewState: { predefinedFields },
  source
}) {
  yield put({
    type: VIEW_INITIALIZE,
    payload: { predefinedFields },
    meta: { source }
  });

  return (yield spawn(function*() {
    try {
      yield call(scenarioSaga, { modelDefinition, softRedirectSaga });
    } finally {
      if (yield cancelled()) {
        yield put({
          type: VIEW_REDIRECT_SUCCESS
        });
      }
    }
  }));
}
