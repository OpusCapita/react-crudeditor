import { call, put } from 'redux-saga/effects';

import instanceEditManager from './edit';

import {
  INSTANCE_FIELD_VALIDATE,

  INSTANCE_SAVE_FAIL,
  INSTANCE_SAVE_REQUEST,
  INSTANCE_SAVE_SUCCESS,

  VIEW_NAME
} from './constants';

function* instanceValidateManager(modelDefinition) {
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

  const fieldErrors = Object.keys(errors.fields).reduce(
    (rez, name) => errors.fields[name].length === 0 ?
      rez : {
        ...rez,
        [name]: errors.fields[name]
      },
    {}
  );

  if (Object.keys(fieldErrors).length) {
    throw fieldErrors;
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

function* instanceUpdateManager(modelDefinition) {
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

/*
 * XXX: in case of failure, a worker saga must dispatch an appropriate action and exit by throwing an error.
 */
export default function* (modelDefinition, {
  payload: { afterAction } = {}
}) {
  try {
    yield call(instanceValidateManager, modelDefinition);
  } catch(err) {
    throw err;
  }

  try {
    yield call(instanceUpdateManager, modelDefinition);
  } catch(err) {
    throw err;
  }

  if (afterAction === AFTER_ACTION_NEW) {
    yield put({
      type: VIEW_REDIRECT_REQUEST,
      payload: {
        viewName: VIEW_CREATE,
      }
    });

    const action = yield take([VIEW_REDIRECT_SUCCESS, VIEW_REDIRECT_FAIL]);

    if (action.type === VIEW_REDIRECT_FAIL) {
      throw action.payload;
    }
  } else if (afterAction === AFTER_ACTION_NEXT) {
    // TODO: get next instance
    const nextInstance = {};

    try {
      yield call(instanceEditManager, modelDefinition, nextInstance);
    } catch(err) {
      throw err;
    }
  }
}
