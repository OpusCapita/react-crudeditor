import { call, put, takeLatest, takeEvery, all, select } from 'redux-saga/effects';
import isEqual from 'lodash/isEqual';

import { getActiveViewName } from '../../common/selectors';
import { getLogicalIdBuilder } from '../lib';

import {
  getActiveTab,
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
    (yield select(getStatus, entityConfiguration)) === READY &&
    (yield select(getActiveViewName, entityConfiguration)) === VIEW_NAME &&
    (currentInstance = yield select(getPersistentInstance, entityConfiguration)) &&
    (logicalIdBuilder = getLogicalIdBuilder(entityConfiguration.model.logicalId)) &&
    isEqual(logicalIdBuilder(currentInstance), logicalId)
  ) {  // Prevent duplicate API call when view name/state props are received in response to onTransition({name,state}) call.
    const currentActiveTab = yield select(getActiveTab, entityConfiguration);

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
