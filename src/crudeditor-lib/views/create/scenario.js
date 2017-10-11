import { take, cancel, call, fork, cancelled, put, spawn } from 'redux-saga/effects';

import createSaga from './workerSagas/create';
import exitSaga from './workerSagas/exit';
import saveSaga from './workerSagas/save';

import {
  INSTANCE_SAVE,
  VIEW_EXIT,

  VIEW_INITIALIZE_REQUEST,
  VIEW_INITIALIZE_FAIL,
  VIEW_INITIALIZE_SUCCESS,

  VIEW_REDIRECT_SUCCESS
} from './constants';

// See Search View scenarioSaga in ../search/scenario for detailed description of the saga.
function* scenarioSaga({ modelDefinition, softRedirectSaga }) {
  const choices = {
    blocking: {},
    nonBlocking: {
      [INSTANCE_SAVE]: saveSaga,
      [VIEW_EXIT]: exitSaga
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

    if (~Object.keys(choices.blocking).indexOf(action.type)) {
      try {
        yield call(choices.blocking[action.type], {
          modelDefinition,
          softRedirectSaga,
          action
        });
      } catch (errors) {
        // throw errors;  // Comment out the line to swallow all errors in called task.
      }
    } else if (~Object.keys(choices.nonBlocking).indexOf(action.type)) {
      lastTask = yield fork(function*() {
        try {
          yield call(choices.nonBlocking[action.type], {
            modelDefinition,
            softRedirectSaga,
            action
          });
        } catch (errors) {
          // throw errors;  // Comment out the line to swallow all errors in forked task.
        }
      });
    }
  }
}

// See Search View scenario for detailed description of the saga.
export default function*({
  modelDefinition,
  softRedirectSaga,
  viewState: {
    instance
  },
  source
}) {
  yield put({
    type: VIEW_INITIALIZE_REQUEST,
    meta: { source }
  });

  try {
    yield call(createSaga, {
      modelDefinition,
      action: {
        payload: { instance },
        meta: { source }
      }
    });
  } catch (errors) {
    yield put({
      type: VIEW_INITIALIZE_FAIL,
      payload: errors,
      error: true,
      meta: { source }
    });

    throw errors; // Initialization errors are forwarded to the parent saga.
  }

  yield put({
    type: VIEW_INITIALIZE_SUCCESS,
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
