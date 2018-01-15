import { put, select, call } from 'redux-saga/effects';

import {
  VIEW_NAME as CREATE_VIEW,
  ALL_INSTANCE_FIELDS_VALIDATE as CREATE_ALL_INSTANCE_FIELDS_VALIDATE,
  INSTANCE_VALIDATE_REQUEST as CREATE_INSTANCE_VALIDATE_REQUEST,
  INSTANCE_VALIDATE_FAIL as CREATE_INSTANCE_VALIDATE_FAIL,
  INSTANCE_VALIDATE_SUCCESS as CREATE_INSTANCE_VALIDATE_SUCCESS
} from '../../views/create/constants';

import {
  VIEW_NAME as EDIT_VIEW,
  ALL_INSTANCE_FIELDS_VALIDATE as EDIT_ALL_INSTANCE_FIELDS_VALIDATE,
  INSTANCE_VALIDATE_REQUEST as EDIT_INSTANCE_VALIDATE_REQUEST,
  INSTANCE_VALIDATE_FAIL as EDIT_INSTANCE_VALIDATE_FAIL,
  INSTANCE_VALIDATE_SUCCESS as EDIT_INSTANCE_VALIDATE_SUCCESS
} from '../../views/edit/constants';

const ALL_INSTANCE_FIELDS_VALIDATE = {
  [CREATE_VIEW]: CREATE_ALL_INSTANCE_FIELDS_VALIDATE,
  [EDIT_VIEW]: EDIT_ALL_INSTANCE_FIELDS_VALIDATE
}

const INSTANCE_VALIDATE_REQUEST = {
  [CREATE_VIEW]: CREATE_INSTANCE_VALIDATE_REQUEST,
  [EDIT_VIEW]: EDIT_INSTANCE_VALIDATE_REQUEST
}

const INSTANCE_VALIDATE_FAIL = {
  [CREATE_VIEW]: CREATE_INSTANCE_VALIDATE_FAIL,
  [EDIT_VIEW]: EDIT_INSTANCE_VALIDATE_FAIL
}

const INSTANCE_VALIDATE_SUCCESS = {
  [CREATE_VIEW]: CREATE_INSTANCE_VALIDATE_SUCCESS,
  [EDIT_VIEW]: EDIT_INSTANCE_VALIDATE_SUCCESS
}

/*
 * Instance validation. Used in 'create' and 'edit' views before saving/updating instance
 */
export default function* validateSaga({ modelDefinition, meta, viewName }) {
  yield put({
    type: ALL_INSTANCE_FIELDS_VALIDATE[viewName],
    meta
  });

  const [
    instance,
    fieldErrors
  ] = yield select(({
    views: {
      [viewName]: {
        formInstance,
        errors: {
          fields: fieldErrors
        }
      }
    }
  }) => [
    formInstance,
    fieldErrors
  ]);

  if (Object.keys(fieldErrors).length) {
    throw fieldErrors;
  }

  yield put({
    type: INSTANCE_VALIDATE_REQUEST[viewName],
    meta
  });

  try {
    yield call(modelDefinition.model.validate, ({ instance, viewName }));
  } catch (err) {
    yield put({
      type: INSTANCE_VALIDATE_FAIL[viewName],
      payload: err,
      error: true,
      meta
    });

    throw err;
  }

  yield put({
    type: INSTANCE_VALIDATE_SUCCESS[viewName],
    meta
  });
}
