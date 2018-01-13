import { take, cancel, call, fork, cancelled, put } from 'redux-saga/effects';

import {
  VIEW_CREATE,
  VIEW_EDIT,
  VIEW_SHOW,
  VIEW_SEARCH,
  VIEW_ERROR
} from './constants';

import { VIEW_REDIRECT_SUCCESS as CREATE_VIEW_REDIRECT_SUCCESS } from '../views/create/constants';
import { VIEW_REDIRECT_SUCCESS as EDIT_VIEW_REDIRECT_SUCCESS } from '../views/edit/constants';
import { VIEW_REDIRECT_SUCCESS as SHOW_VIEW_REDIRECT_SUCCESS } from '../views/show/constants';
import { VIEW_REDIRECT_SUCCESS as SEARCH_VIEW_REDIRECT_SUCCESS } from '../views/search/constants';
import { VIEW_REDIRECT_SUCCESS as ERROR_VIEW_REDIRECT_SUCCESS } from '../views/error/constants';

const VIEW_REDIRECT_SUCCESS = {
  [VIEW_CREATE]: CREATE_VIEW_REDIRECT_SUCCESS,
  [VIEW_EDIT]: EDIT_VIEW_REDIRECT_SUCCESS,
  [VIEW_SHOW]: SHOW_VIEW_REDIRECT_SUCCESS,
  [VIEW_SEARCH]: SEARCH_VIEW_REDIRECT_SUCCESS,
  [VIEW_ERROR]: ERROR_VIEW_REDIRECT_SUCCESS
}

/*
 * View life cycle scenario saga.
 * It must handle all errors and do clean-up on cancelation (happens on soft/hard redirect).
 *
 * When the view wants to exit during its life cycle, it must call softRedirectSaga
 * which cancels life cycle scenario-saga in case of successful redirect,
 * or throws error(s) otherwise
 * => softRedirectSaga must be passed to all worker sagas.
 */
const scenarioSaga = /* istanbul ignore next */ function*({
  modelDefinition,
  softRedirectSaga,
  transitions,
  viewName
}) {
  let lastTask;

  while (true) {
    const action = yield take([
      ...Object.keys(transitions.blocking),
      ...Object.keys(transitions.nonBlocking)
    ]);

    // Automatically cancel any task started previously if it's still running.
    if (lastTask) {
      yield cancel(lastTask);
    }

    if (Object.keys(transitions.blocking).indexOf(action.type) > -1) {
      try {
        yield call(transitions.blocking[action.type], {
          modelDefinition,
          softRedirectSaga,
          action: {
            ...action,
            meta: {
              ...action.meta,
              spawner: viewName
            }
          }
        });
      } catch (err) {
        // Swallow all errors; do not console auxiliary CRUD Editor errors.
        if (err instanceof Error) {
          console.warn(err);
        }
      }
    } else if (Object.keys(transitions.nonBlocking).indexOf(action.type) > -1) {
      lastTask = yield fork(function*() {
        try {
          yield call(transitions.nonBlocking[action.type], {
            modelDefinition,
            softRedirectSaga,
            action: {
              ...action,
              meta: {
                ...action.meta,
                spawner: viewName
              }
            }
          });
        } catch (err) {
          // Swallow all errors; do not console auxiliary CRUD Editor errors.
          if (err instanceof Error) {
            console.warn(err);
          }
        }
      });
    }
  }
};

export default function*({
  modelDefinition,
  softRedirectSaga,
  transitions,
  viewName
}) {
  try {
    yield call(scenarioSaga, {
      modelDefinition,
      softRedirectSaga,
      transitions,
      viewName
    });
  } finally {
    if (yield cancelled()) {
      yield put({
        type: VIEW_REDIRECT_SUCCESS[viewName]
      });
    }
  }
}
