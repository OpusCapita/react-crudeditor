import { put, call, select } from 'redux-saga/effects';

import {
  VIEW_NAME as CREATE_VIEW,
  INSTANCE_SAVE_REQUEST as CREATE_INSTANCE_SAVE_REQUEST,
  INSTANCE_SAVE_FAIL as CREATE_INSTANCE_SAVE_FAIL,
  INSTANCE_SAVE_SUCCESS as CREATE_INSTANCE_SAVE_SUCCESS
} from '../../views/create/constants';

import {
  VIEW_NAME as EDIT_VIEW,
  INSTANCE_SAVE_REQUEST as EDIT_INSTANCE_SAVE_REQUEST,
  INSTANCE_SAVE_FAIL as EDIT_INSTANCE_SAVE_FAIL,
  INSTANCE_SAVE_SUCCESS as EDIT_INSTANCE_SAVE_SUCCESS
} from '../../views/edit/constants';

const INSTANCE_SAVE_REQUEST = {
  [CREATE_VIEW]: CREATE_INSTANCE_SAVE_REQUEST,
  [EDIT_VIEW]: EDIT_INSTANCE_SAVE_REQUEST
}

const INSTANCE_SAVE_FAIL = {
  [CREATE_VIEW]: CREATE_INSTANCE_SAVE_FAIL,
  [EDIT_VIEW]: EDIT_INSTANCE_SAVE_FAIL
}

const INSTANCE_SAVE_SUCCESS = {
  [CREATE_VIEW]: CREATE_INSTANCE_SAVE_SUCCESS,
  [EDIT_VIEW]: EDIT_INSTANCE_SAVE_SUCCESS
}

const viewSaveApi = {
  [CREATE_VIEW]: 'create',
  [EDIT_VIEW]: 'update'
}

export default function* saveSaga({ modelDefinition, meta }) {
  const viewName = meta.spawner;

  yield put({
    type: INSTANCE_SAVE_REQUEST[viewName],
    meta
  });

  let instance;

  try {
    instance = yield call(modelDefinition.api[viewSaveApi[viewName]], {
      instance: yield select(storeState => storeState.views[viewName].formInstance)
    });
  } catch (err) {
    yield put({
      type: INSTANCE_SAVE_FAIL[viewName],
      payload: err,
      error: true,
      meta
    });

    throw err;
  }

  yield put({
    type: INSTANCE_SAVE_SUCCESS[viewName],
    payload: { instance },
    meta
  });

  return instance
}
