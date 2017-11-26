import { take, cancel, call, fork, cancelled, put, spawn } from 'redux-saga/effects';

import deleteSaga from '../../common/workerSagas/delete';
import searchSaga from './workerSagas/search';
import editSaga from './workerSagas/edit';
import showSaga from './workerSagas/show';
import createSaga from './workerSagas/create';
import redirectSaga from '../../common/workerSagas/redirect';

import {
  INSTANCES_DELETE,
  VIEW_SOFT_REDIRECT
} from '../../common/constants';

import { INSTANCE_EDIT } from '../edit/constants';
import { INSTANCE_SHOW } from '../show/constants';
import { INSTANCE_CREATE } from '../create/constants';

import {
  INSTANCES_SEARCH,

  VIEW_INITIALIZE_REQUEST,
  VIEW_INITIALIZE_FAIL,
  VIEW_INITIALIZE_SUCCESS,

  VIEW_NAME,
  VIEW_REDIRECT_SUCCESS
} from './constants';

/*
 * View life cycle scenario saga.
 * It must handle all errors and do clean-up on cancelation (happens on soft/hard redirect).
 *
 * When the view wants to exit during its life cycle, it must call softRedirectSaga
 * which cancels life cycle scenario-saga in case of successful redirect,
 * or throws error(s) otherwise
 * => softRedirectSaga must be passed to all worker sagas.
 */
function* scenarioSaga({ modelDefinition, softRedirectSaga }) {
  const choices = {
    blocking: {
      [INSTANCES_DELETE]: deleteSaga,
    },
    nonBlocking: {
      [INSTANCES_SEARCH]: searchSaga,
      [INSTANCE_EDIT]: editSaga,
      [INSTANCE_SHOW]: showSaga,
      [INSTANCE_CREATE]: createSaga,
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
        // refresh search results
        if (action.type === INSTANCES_DELETE) {
          try {
            yield call(searchSaga, {
              modelDefinition,
              softRedirectSaga,
              action: {
                payload: {}
              }
            });
          } catch (err) {
            throw err;
          }
        }
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

/*
 * The saga initializes the view and
 * -- returns its life cycle scenario-saga in case of successful initialization
 * or
 * -- throws error(s) otherwise.
 *
 *  source is relevant only for initialization but not for life cycle.
 *  It is because initialization process and its result must not be reported to owner app.
 */
export default function*({
  modelDefinition,
  softRedirectSaga,
  viewState: {
    filter,
    sort,
    order,
    max,
    offset
  } = {},
  source
}) {
  yield put({
    type: VIEW_INITIALIZE_REQUEST,
    meta: { source }
  });

  try {
    yield call(searchSaga, {
      modelDefinition,
      action: {
        payload: {
          filter,
          sort,
          order,
          max,
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
