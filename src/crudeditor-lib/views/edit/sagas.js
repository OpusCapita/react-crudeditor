import { call, put, takeLatest, takeEvery, all, select } from 'redux-saga/effects';
import isEqual from 'lodash/isEqual';

import { getLogicalIdBuilder } from '../lib';

import {
  INSTANCE_EDIT,
  INSTANCE_EDIT_FAIL,
  INSTANCE_EDIT_REQUEST,
  INSTANCE_EDIT_SUCCESS,
  READY,
  VIEW_NAME
} from './constants';

export function* onInstanceEdit(entityConfiguration, {
  payload: {
    instance: logicalId,
    activeTabName
  },
  meta: { source }
}) {
  let currentInstance;
  let logicalIdBuilder;

  if (source === 'owner' &&
    (yield select(storeState => storeState.views[VIEW_NAME].status)) === READY &&
    (yield select(storeState => storeState.common.activeViewName)) === VIEW_NAME &&
    (currentInstance = yield select(storeState => storeState.views[VIEW_NAME].persistentInstances)) &&
    (logicalIdBuilder = getLogicalIdBuilder(entityConfiguration.model.logicalId)) &&
    isEqual(logicalIdBuilder(currentInstance), logicalId)
  ) {  // Prevent duplicate API call when view name/state props are received in response to onTransition({name,state}) call.
    const currentActiveTab = yield select(storeState => storeState.views[VIEW_NAME].activeTab);

    if (activeTabName !== currentActiveTab.tab) {
      yield put({
        type: INSTANCE_EDIT_SUCCESS,
        payload: {
          activeTabName
        },
        meta: { source }
      });
    }

    return;
  }

  yield put({
    type: INSTANCE_EDIT_REQUEST,
    meta: { source }
  });

  try {
    const instance = yield call(entityConfiguration.api.get, logicalId);

    yield put({
      type: INSTANCE_EDIT_SUCCESS,
      payload: {
        instance,
        activeTabName
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
    takeEvery(INSTANCE_EDIT, onInstanceEdit, entityConfiguration)
  ]);
}
