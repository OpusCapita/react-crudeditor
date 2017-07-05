import { put, takeLatest, all, select } from 'redux-saga/effects';

import { actions as searchActions } from '../views/search';
import { actions as createActions } from '../views/create';
import { actions as editActions } from '../views/edit';
import { actions as showActions } from '../views/show';

import { getActiveView } from './selectors';

import {
  VIEW_SEARCH,
  VIEW_CREATE,
  VIEW_EDIT,
  VIEW_SHOW,
  DEFAULT_VIEW,
  VIEW_INITIALIZE,
  VIEW_NAME_CHANGE
} from './constants';

const { searchInstances } = searchActions;
const { createInstance } = createActions;
const { editInstance } = editActions;
const { showInstance } = showActions;

function* onViewInitialize(entityConfiguration, {
  payload: {
    viewName,
    viewState
  },
  meta: {
    source
  }
}) {
  viewName = viewName || (yield select(getActiveView)) || DEFAULT_VIEW;

  // ask specific view to process new input and
  // if success display the view, otherwise display error page.
  yield put(
    viewName === VIEW_SEARCH && searchInstances({
      filter : viewState.filter,
      sort   : viewState.sort,
      order  : viewState.order,
      max    : viewState.max,
      offset : viewState.offset
    }, source) ||
    viewName === VIEW_CREATE && createInstance(viewState, source) ||
    viewName === VIEW_EDIT && editInstance(viewState, source) ||
    viewName === VIEW_SHOW && showInstance(viewState, source)
  );

  yield put({
    type: VIEW_NAME_CHANGE,
    payload: viewName,
    meta: { source }
  });
}

export default function*(entityConfiguration) {
  yield all([
    takeLatest(VIEW_INITIALIZE, onViewInitialize, entityConfiguration)  // TODO: cancel all running sagas.
  ]);
}
