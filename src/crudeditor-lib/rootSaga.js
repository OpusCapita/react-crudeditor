import { put, fork, take, cancel, takeLatest } from 'redux-saga/effects';

import searchViewScenario from './views/search/scenario';
import createViewScenario from './views/create/scenario';
import editViewScenario from './views/edit/scenario';
import showViewScenario from './views/show/scenario';
import errorViewScenario from './views/error/scenario';

import {
  ACTIVE_VIEW_CHANGE,
  DEFAULT_VIEW,
  ERROR_UNKNOWN_VIEW,

  VIEW_INITIALIZE_FAIL,
  VIEW_INITIALIZE_SUCCESS,

  VIEW_REDIRECT_FORCE,
  VIEW_REDIRECT_REQUEST,
  VIEW_REDIRECT_FAIL,
  VIEW_REDIRECT_SUCCESS,

  VIEW_SEARCH,
  VIEW_CREATE,
  VIEW_EDIT,
  VIEW_SHOW,
  VIEW_ERROR
} from './common/constants';

const viewScenarios = {
  [VIEW_SEARCH]: searchViewScenario,
  [VIEW_CREATE]: createViewScenario,
  [VIEW_EDIT  ]: editViewScenario,
  [VIEW_SHOW  ]: showViewScenario,
  [VIEW_ERROR ]: errorViewScenario
};

let activeViewScenario;

/*
 * The saga handles an active view request for replacements with another view.
 *
 * Communication with active view manager saga is conducted throught Redux actions,
 * i.e. the request is answered with dispatching either VIEW_REDIRECT_SUCCESS or VIEW_REDIRECT_FAIL actions.
 *
 * The saga attempts to initialize requested view without displaying it.
 * When successful, it dispatches VIEW_REDIRECT_SUCCESS action
 * and replaces currently active view with requested one
 * (by canceling active view manager saga and displaying requested view).
 * When view initialization failured, the saga dispatches VIEW_REDIRECT_FAIL.
 */
function* viewRedirectRequestScenario({ modelDefinition, requester }, {
  payload: {
    viewName,
    viewState
  }
}) {
  const requestedViewScenario = viewScenarios[viewName];

  if (!requestedViewScenario) {
    yield put({
      type: VIEW_REDIRECT_FAIL,
      payload: ERROR_UNKNOWN_VIEW(viewName),
      error: true,
      meta: { requester }
    });

    return;
  }

  // Initialize the view and, if successful, handle charge over to the view.
  // XXX: no errors are catched => the view itself must handle them.
  const viewTask = yield fork(requestedViewScenario, {
    modelDefinition,
    viewState,
    source: 'self'
  });

  const action = yield take([VIEW_INITIALIZE_FAIL, VIEW_INITIALIZE_SUCCESS]);

  if (action.type === VIEW_INITIALIZE_FAIL) {
    yield cancel(viewTask);

    yield put({
      type: VIEW_REDIRECT_FAIL,
      payload: action.payload,
      error: true,
      meta: { requester }
    });

    return;
  }

  yield put({
    type: VIEW_REDIRECT_SUCCESS,
    meta: { requester }
  });

  yield cancel(activeViewScenario);

  yield put({
    type: ACTIVE_VIEW_CHANGE,
    payload: { viewName }
  });

  activeViewScenario = requestedViewScenario;
}

/*
 * The saga handles initial view loading and view re-initialization,
 * i.e. cases when currently active view, if exists, must not remain.
 *
 * Requested view gets displayed immediately even if uninitialized.
 *
 * After initialization the view either remains or replaced with error view (if initialization failed).
 */
function* viewRedirectForceScenario(modelDefinition, {
  payload: {
    viewName = DEFAULT_VIEW,
    viewState
  }
}) {
  activeViewScenario = viewScenarios[viewName];

  if (!activeViewScenario) {
    activeViewScenario = errorViewScenario;
    viewState = ERROR_UNKNOWN_VIEW(viewName);
    viewName = VIEW_ERROR;
  }

  yield put({
    type: ACTIVE_VIEW_CHANGE,
    payload: { viewName },
    meta: {
      source: 'owner'
    }
  });

  // Handle charge over to the view.
  // XXX: no errors are catched => the view itself must handle them.
  const viewTask = yield fork(activeViewScenario, {
    modelDefinition,
    viewState,
    source: 'owner'
  });

  const action = yield take([VIEW_INITIALIZE_FAIL, VIEW_INITIALIZE_SUCCESS]);

  if (viewName !== VIEW_ERROR && action.type === VIEW_INITIALIZE_FAIL) {
    yield cancel(viewTask);
    activeViewScenario = errorViewScenario;
    viewState = action.payload;  // Error is taken from action.payload
    viewName = VIEW_ERROR;
  }

  yield takeLatest(VIEW_REDIRECT_REQUEST, viewRedirectRequestScenario, { modelDefinition, requester: viewName });
}

export default function*(modelDefinition) {
  yield takeLatest(VIEW_REDIRECT_FORCE, viewRedirectForceScenario, modelDefinition);
};
