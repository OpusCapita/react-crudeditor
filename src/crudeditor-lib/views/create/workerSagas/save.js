import { call, put, select } from 'redux-saga/effects';

import {
  AFTER_ACTION_NEW,

  ALL_INSTANCE_FIELDS_VALIDATE,

  INSTANCE_FIELD_VALIDATE,

  INSTANCE_SAVE_REQUEST,
  INSTANCE_SAVE_FAIL,
  INSTANCE_SAVE_SUCCESS,

  INSTANCE_VALIDATE_REQUEST,
  INSTANCE_VALIDATE_FAIL,
  INSTANCE_VALIDATE_SUCCESS,

  VIEW_INITIALIZE,
  VIEW_NAME
} from '../constants';

import { VIEW_ERROR } from '../../../common/constants'

// import createSaga from './create';
import editSaga from './edit';

/*
 * Instance validation
 */
function* validateSaga(modelDefinition, meta) {
  const divergedField = yield select(storeState => storeState.views[VIEW_NAME].divergedField);

  if (divergedField) {
    // ENTER key was pressed in one of form inputs =>
    // the input's onBlur() was not called and vallues was not parsed as a result =>
    // mimic onBlur() event handler:
    yield put({
      type: INSTANCE_FIELD_VALIDATE,
      payload: {
        name: divergedField
      },
      meta
    });
  }

  yield put({
    type: ALL_INSTANCE_FIELDS_VALIDATE,
    meta
  });

  const [
    instance,
    errors
  ] = yield select(({
    views: {
      [VIEW_NAME]: {
        formatedInstance,
        errors
      }
    }
  }) => [
    formatedInstance,
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
    meta
  });

  try {
    yield call(modelDefinition.model.validate, instance);
  } catch (err) {
    yield put({
      type: INSTANCE_VALIDATE_FAIL,
      payload: err,
      error: true,
      meta
    });

    throw err;
  }

  yield put({
    type: INSTANCE_VALIDATE_SUCCESS,
    meta
  });
}

function* saveSaga(modelDefinition, meta) {
  const instance = yield select(storeState => storeState.views[VIEW_NAME].formInstance);

  yield put({
    type: INSTANCE_SAVE_REQUEST,
    meta
  });

  let savedInstance;

  try {
    savedInstance = yield call(modelDefinition.api.create, { instance });
  } catch (err) {
    yield put({
      type: INSTANCE_SAVE_FAIL,
      payload: err,
      error: true,
      meta
    });

    throw err;
  }

  yield put({
    type: INSTANCE_SAVE_SUCCESS,
    payload: {
      instance: savedInstance
    },
    meta
  });

  return savedInstance
}

/*
 * XXX: in case of failure, a worker saga must dispatch an appropriate action and exit by throwing error(s).
 */
export default function*({
  modelDefinition,
  softRedirectSaga,
  action: {
    payload: { afterAction } = {},
    meta
  }
}) {
  yield call(validateSaga, modelDefinition, meta); // Forwarding thrown error(s) to the parent saga.

  const savedInstance = yield call(saveSaga, modelDefinition, meta);

  if (afterAction === AFTER_ACTION_NEW) {
    // create another instance
    yield put({
      type: VIEW_INITIALIZE,
      payload: { predefinedFields: {} },
      meta
    });
  } else {
    try {
      const tab = yield select(storeState => storeState.views[VIEW_NAME].activeTab);
      yield call(editSaga, {
        modelDefinition,
        softRedirectSaga,
        action: {
          payload: {
            instance: savedInstance,
            tab: tab && tab.tab
          },
          meta
        }
      })
    } catch (err) {
      yield call(softRedirectSaga, {
        viewName: VIEW_ERROR,
        viewState: err
      });
    }
  }
}
