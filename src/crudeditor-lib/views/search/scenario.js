import { call, put, spawn } from 'redux-saga/effects';

import deleteSaga from './workerSagas/delete';
import searchSaga from './workerSagas/search';
import redirectSaga from '../../common/workerSagas/redirect';
import scenarioSaga from '../../common/scenario';

import {
  INSTANCES_DELETE,
  VIEW_SOFT_REDIRECT
} from '../../common/constants';

import {
  INSTANCES_SEARCH,

  VIEW_INITIALIZE_REQUEST,
  VIEW_INITIALIZE_FAIL,
  VIEW_INITIALIZE_SUCCESS,

  VIEW_NAME
} from './constants';

const transitions = {
  blocking: {
    [INSTANCES_DELETE]: deleteSaga,
  },
  nonBlocking: {
    [INSTANCES_SEARCH]: searchSaga,
    [VIEW_SOFT_REDIRECT]: redirectSaga
  }
};

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
    payload: {
      hideSearchForm: false // TODO: set correct value
    },
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

  return (yield spawn(scenarioSaga, {
    modelDefinition,
    softRedirectSaga,
    transitions,
    viewName: VIEW_NAME
  }));
}
