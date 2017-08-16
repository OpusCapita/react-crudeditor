import { call, put, takeLatest, takeEvery, all, select } from 'redux-saga/effects';
import isEqual from 'lodash/isEqual';

import { getLogicalKeyBuilder } from '../lib';

import {
  INSTANCE_EDIT,
  INSTANCE_EDIT_FAIL,
  INSTANCE_EDIT_REQUEST,
  INSTANCE_EDIT_SUCCESS,
  READY,
  VIEW_NAME
} from './constants';

export function* onInstanceEdit(modelDefinition, {
  payload: {
    instance,
    activeTabName
  },
  meta: { source }
}) {
  const buildLogicalKey = getLogicalKeyBuilder(modelDefinition.model.fields);
  const currentInstance = yield select(storeState => storeState.views[VIEW_NAME].persistentInstance);

  if (source === 'owner' &&
    (yield select(storeState => storeState.views[VIEW_NAME].status)) === READY &&
    (yield select(storeState => storeState.common.activeViewName)) === VIEW_NAME &&
    currentInstance &&
    isEqual(
      buildLogicalKey(currentInstance),
      buildLogicalKey(instance)
    )
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
    instance = yield call(modelDefinition.api.get, { instance });

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

export default function*(modelDefinition) {
  yield all([
    takeEvery(INSTANCE_EDIT, onInstanceEdit, modelDefinition)
  ]);
}
