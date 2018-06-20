import { put, select, call } from 'redux-saga/effects';

import {
  VIEW_NAME as CREATE_VIEW,
  ALL_INSTANCE_FIELDS_VALIDATE_REQUEST as CREATE_ALL_INSTANCE_FIELDS_VALIDATE_REQUEST,
  ALL_INSTANCE_FIELDS_VALIDATE_FAIL as CREATE_ALL_INSTANCE_FIELDS_VALIDATE_FAIL,
  INSTANCE_VALIDATE_REQUEST as CREATE_INSTANCE_VALIDATE_REQUEST,
  INSTANCE_VALIDATE_FAIL as CREATE_INSTANCE_VALIDATE_FAIL,
  INSTANCE_VALIDATE_SUCCESS as CREATE_INSTANCE_VALIDATE_SUCCESS
} from '../../views/create/constants';

import {
  VIEW_NAME as EDIT_VIEW,
  ALL_INSTANCE_FIELDS_VALIDATE_REQUEST as EDIT_ALL_INSTANCE_FIELDS_VALIDATE_REQUEST,
  ALL_INSTANCE_FIELDS_VALIDATE_FAIL as EDIT_ALL_INSTANCE_FIELDS_VALIDATE_FAIL,
  INSTANCE_VALIDATE_REQUEST as EDIT_INSTANCE_VALIDATE_REQUEST,
  INSTANCE_VALIDATE_FAIL as EDIT_INSTANCE_VALIDATE_FAIL,
  INSTANCE_VALIDATE_SUCCESS as EDIT_INSTANCE_VALIDATE_SUCCESS
} from '../../views/edit/constants';

const ALL_INSTANCE_FIELDS_VALIDATE_REQUEST = {
  [CREATE_VIEW]: CREATE_ALL_INSTANCE_FIELDS_VALIDATE_REQUEST,
  [EDIT_VIEW]: EDIT_ALL_INSTANCE_FIELDS_VALIDATE_REQUEST
}

const ALL_INSTANCE_FIELDS_VALIDATE_FAIL = {
  [CREATE_VIEW]: CREATE_ALL_INSTANCE_FIELDS_VALIDATE_FAIL,
  [EDIT_VIEW]: EDIT_ALL_INSTANCE_FIELDS_VALIDATE_FAIL
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
    type: ALL_INSTANCE_FIELDS_VALIDATE_REQUEST[viewName],
    meta
  });

  const [
    persistentInstance,
    formInstance,
    fieldErrors
  ] = yield select(({
    views: {
      [viewName]: {
        persistentInstance,
        formInstance,
        errors: {
          fields: fieldErrors
        }
      }
    }
  }) => [
    persistentInstance || null, // Create View does not have a persistent instance, only Edit View does.
    formInstance,
    fieldErrors
  ]);

  const errors = Object.keys(fieldErrors).reduce(
    (rez, fieldName) => [
      ...rez,
      ...fieldErrors[fieldName].map(error => ({
        ...error,
        field: fieldName
      }))
    ],
    []
  );

  if (errors.length) {
    yield put({
      type: ALL_INSTANCE_FIELDS_VALIDATE_FAIL[viewName],
      payload: errors,
      error: true,
      meta
    });

    throw errors;
  }

  yield put({
    type: INSTANCE_VALIDATE_REQUEST[viewName],
    meta
  });

  try {
    yield call(modelDefinition.model.validate, ({
      persistentInstance,
      formInstance,
      viewName
    }));
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
