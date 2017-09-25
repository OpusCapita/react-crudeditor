import { call, put, takeLatest, takeEvery, all, select } from 'redux-saga/effects';
import isEqual from 'lodash/isEqual';

import { getLogicalKeyBuilder } from '../lib';

import {
  INSTANCE_FIELD_VALIDATE,

  INSTANCE_EDIT,
  INSTANCE_EDIT_FAIL,
  INSTANCE_EDIT_REQUEST,
  INSTANCE_EDIT_SUCCESS,

  INSTANCE_SAVE,
  INSTANCE_SAVE_FAIL,
  INSTANCE_SAVE_REQUEST,
  INSTANCE_SAVE_SUCCESS,

  INSTANCE_VALIDATE,
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
  const currentActiveTab = yield select(storeState => storeState.views[VIEW_NAME].activeTab);

  if (source === 'owner' &&
    (yield select(storeState => storeState.views[VIEW_NAME].status)) === READY &&
    (yield select(storeState => storeState.common.activeViewName)) === VIEW_NAME &&
    currentInstance &&
    isEqual(
      buildLogicalKey(currentInstance),
      buildLogicalKey(instance)
    ) &&
    (!activeTabName || !currentActiveTab || activeTabName === currentActiveTab.tab)
  ) {  // Prevent duplicate API call when view name/state props are received in response to onTransition({name,state}) call.
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

export function* onInstanceSave(modelDefinition, {
  payload: {
    afterAction
  } = {}
}) {
  console.log('afterAction', afterAction);
  const divergedField = yield select(storeState => storeState.views[VIEW_NAME].divergedField);

  if (divergedField) {
    // ENTER key was pressed in one of form inputs =>
    // the input's onBlur() was not called and vallues was not parsed as a result =>
    // mimic onBlur() event handler:
    yield put({
      type: INSTANCE_FIELD_VALIDATE,
      payload: {
        name: divergedField
      }
    });
  }

  const [
    instance,
    errors
  ] = yield select(({
    views: {
      [VIEW_NAME]: {
        formInstance,
        errors
      }
    }
  }) => [
    formInstance,
    errors
  ]);

  if (Object.keys(errors.fields).some(name => errors.fields[name].length)) {
    return;
  }

  try {
    yield call(modelDefinition.model.validate, instance);

    yield put({
      type: INSTANCE_VALIDATE,
      payload: {
        errors: []
      }
    });

    yield put({
      type: INSTANCE_SAVE_REQUEST
    });

    try {
      const updated = yield call(modelDefinition.api.update, { instance });
      const activeTab = yield select(storeState => storeState.views[VIEW_NAME].activeTab);

      yield put({
        type: INSTANCE_SAVE_SUCCESS,
        payload: {
          instance: updated,
          activeTabName: activeTab ? activeTab.tab : undefined
        }
      });
    } catch (err) {
      yield put({
        type: INSTANCE_SAVE_FAIL,
        payload: err,
        error: true
      });
    }
  } catch(errors) {
    yield put({
      type: INSTANCE_VALIDATE,
      payload: { errors }
    });
  }
}

export default function*(modelDefinition) {
  yield all([
    takeEvery(INSTANCE_EDIT, onInstanceEdit, modelDefinition),
    takeEvery(INSTANCE_SAVE, onInstanceSave, modelDefinition)
  ]);
}
