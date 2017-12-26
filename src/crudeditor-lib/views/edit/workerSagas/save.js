import { call, put, select } from 'redux-saga/effects';

import editAdjacentSaga from './editAdjacent';
import redirectSaga from '../../../common/workerSagas/redirect';
import { VIEW_CREATE } from '../../../common/constants';
import { getDefaultNewInstance } from '../../search/selectors';

import {
  AFTER_ACTION_NEXT,
  AFTER_ACTION_NEW,

  INSTANCE_SAVE_REQUEST,
  INSTANCE_SAVE_FAIL,
  INSTANCE_SAVE_SUCCESS,

  INSTANCE_VALIDATE_REQUEST,
  INSTANCE_VALIDATE_FAIL,
  INSTANCE_VALIDATE_SUCCESS,

  ALL_INSTANCE_FIELDS_VALIDATE,

  VIEW_NAME
} from '../constants';

/*
 * Instance validation
 */
function* validateSaga(modelDefinition, meta) {
  yield put({
    type: ALL_INSTANCE_FIELDS_VALIDATE,
    meta
  });

  const [
    instance,
    fieldErrors
  ] = yield select(({
    views: {
      [VIEW_NAME]: {
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

function* updateSaga(modelDefinition, meta) {
  yield put({
    type: INSTANCE_SAVE_REQUEST,
    meta
  });

  let instance;

  try {
    instance = yield call(modelDefinition.api.update, {
      instance: yield select(storeState => storeState.views[VIEW_NAME].formInstance)
    });
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
    payload: { instance },
    meta
  });

  return instance;
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
  // XXX: error(s) thrown in called below sagas are forwarded to the parent saga. Use try..catch to alter this default.

  yield call(validateSaga, modelDefinition, meta);
  yield call(updateSaga, modelDefinition, meta);

  if (afterAction === AFTER_ACTION_NEW) {
    yield call(redirectSaga, {
      modelDefinition,
      softRedirectSaga,
      action: {
        payload: {
          view: {
            name: VIEW_CREATE,
            state: {
              predefinedFields: yield select(storeState => getDefaultNewInstance(storeState, modelDefinition))
            }
          }
        },
        meta
      }
    });
  } else if (afterAction === AFTER_ACTION_NEXT) {
    yield call(editAdjacentSaga, {
      modelDefinition,
      action: {
        payload: {
          step: 1
        },
        meta
      }
    });
  }
}
