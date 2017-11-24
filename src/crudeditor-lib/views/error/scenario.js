import { take, cancel, call, fork, cancelled, put, spawn } from 'redux-saga/effects';

import exitSaga from './workerSagas/exit';

import {
  HOME_GO,
  VIEW_INITIALIZE,
  VIEW_REDIRECT_SUCCESS
} from './constants';

// See Search View scenarioSaga in ../search/scenario for detailed description of the saga.
function* scenarioSaga({ modelDefinition, softRedirectSaga }) {
  const choices = {
    blocking: {},
    nonBlocking: {
      [HOME_GO]: exitSaga
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
          action
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
            action
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
