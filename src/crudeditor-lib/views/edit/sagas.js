import { call, put, takeLatest, takeEvery, all, select } from 'redux-saga/effects';

import { selectors as commonSelectors } from '../../common';
import {
  getPersistentInstance,
  getStatus
} from './selectors';

import {
  INSTANCE_EDIT,
  INSTANCE_EDIT_FAIL,
  INSTANCE_EDIT_REQUEST,
  INSTANCE_EDIT_SUCCESS,
  READY,
  VIEW_NAME
} from './constants';

const {
  getActiveView,
  getIdField
} = commonSelectors;

function* onInstanceEdit(entityConfiguration, {
  payload: {
    id,
    tab = 0
  },
  meta: { source }
}) {
  let instance;

  if (source === 'owner' &&
    (yield select(getStatus, entityConfiguration)) === READY &&
    (yield select(getActiveView, entityConfiguration)) === VIEW_NAME &&
    (instance = yield select(getPersistentInstance, entityConfiguration)) &&
    instance[yield select(getIdField, entityConfiguration)] === id
  ) {  // Prevent duplicate API call when view/state props are received in response to onTransition({view,state}) call.
    return;
  }

  yield put({
    type: INSTANCE_EDIT_REQUEST,
    meta: { source }
  });

  try {
    const instance = yield call(entityConfiguration.api.get, id);

    yield put({
      type: INSTANCE_EDIT_SUCCESS,
      payload: {
        instance,
        tab
      },
      meta: { source }
    });
  } catch (err) {
    yield put({
      type: INSTANCE_EDIT_FAIL,
      payload: err,
      error: true,
      meta: { source }
    });
  }
}

export default function*(entityConfiguration) {
  yield all([
    takeEvery(INSTANCE_EDIT,  onInstanceEdit, entityConfiguration)
  ]);
}
