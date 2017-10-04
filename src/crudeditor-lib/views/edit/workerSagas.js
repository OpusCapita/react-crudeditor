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

export function* instanceEditManager(modelDefinition, instance) {
  const buildLogicalKey = getLogicalKeyBuilder(modelDefinition.model.fields);
  const currentInstance = yield select(storeState => storeState.views[VIEW_NAME].persistentInstance);

  yield put({
    type: INSTANCE_EDIT_REQUEST
  });

  try {
    instance = yield call(modelDefinition.api.get, { instance });

    yield put({
      type: INSTANCE_EDIT_SUCCESS,
      payload: { instance }
    });
  } catch (err) {
    yield put({
      type: INSTANCE_EDIT_FAIL,
      payload: err,
      error: true
    });

    throw err;
  }
}

export function* instanceValidateManager(modelDefinition) {
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

  yield put({
    type: INSTANCE_VALIDATE_REQUEST,
  });

  try {
    yield call(modelDefinition.model.validate, instance);
  } catch(errors) {
    yield put({
      type: INSTANCE_VALIDATE_FAIL,
      payload: errors,
      error: true
    });

    throw errors;
  }

  yield put({
    type: INSTANCE_VALIDATE_SUCCESS,
  });
}

export function* instanceSaveManager(modelDefinition) {
  const instance = yield select(storeState => storeState.views[VIEW_NAME].formInstance);

  yield put({
    type: INSTANCE_SAVE_REQUEST
  });

  try {
    const updated = yield call(modelDefinition.api.update, { instance });

    yield put({
      type: INSTANCE_SAVE_SUCCESS,
      payload: {
        instance: updated
      }
    });
  } catch (err) {
    yield put({
      type: INSTANCE_SAVE_FAIL,
      payload: err,
      error: true
    });

    throw err;
  }
}
