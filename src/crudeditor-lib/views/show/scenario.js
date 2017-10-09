import { take, cancel, call, fork, cancelled, put, spawn } from 'redux-saga/effects';

import showSaga from './workerSagas/show';
import exitSaga from './workerSagas/exit';

import {
  VIEW_EXIT,
  TAB_SELECT,
  VIEW_INITIALIZE_REQUEST,
  VIEW_INITIALIZE_FAIL,
  VIEW_INITIALIZE_SUCCESS,
  VIEW_REDIRECT_SUCCESS
} from './constants';

function* scenarioSaga({ modelDefinition, softRedirectSaga }) {
  const choices = {
    nonBlocking: {
      [VIEW_EXIT]: exitSaga
    }
  }

  let lastTask;

  while (true) {
    const action = yield take([
      ...Object.keys(choices.nonBlocking)
    ]);

    // Automatically cancel any task started previously if it's still running.
    if (lastTask) {
      yield cancel(lastTask);
    }

    if (~Object.keys(choices.nonBlocking).indexOf(action.type)) {
      lastTask = yield fork(function*() {
        try {
          yield call(choices.nonBlocking[action.type], {
            modelDefinition,
            softRedirectSaga,
            action
          });
        } catch (err) {
          throw err; // Comment out the line to swallow all errors in forked task.
        }
      });
    }
  }
}

export default function*({
  modelDefinition,
  softRedirectSaga,
  viewState: {
    instance,
    tab: tabName
  },
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
        payload: { instance },
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

    throw err; // Initialization errors are forwarded to the parent saga.
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
      yield call(scenarioSaga, { modelDefinition, softRedirectSaga });
    } finally {
      if (yield cancelled()) {
        yield put({ // TBD
          type: VIEW_REDIRECT_SUCCESS
        });
      }
    }
  }));
}

