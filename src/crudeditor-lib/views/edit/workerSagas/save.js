import { call, put, select } from 'redux-saga/effects';

import editSaga from './edit';
import searchSaga from '../../search/workerSagas/search';
import redirectSaga from '../../../common/workerSagas/redirect';
import { VIEW_CREATE, ERROR_NOT_FOUND } from '../../../common/constants';
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
  const instance = yield select(storeState => storeState.views[VIEW_NAME].formInstance);

  yield put({
    type: INSTANCE_SAVE_REQUEST,
    meta
  });

  let updated;

  try {
    updated = yield call(modelDefinition.api.update, { instance });
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
      instance: updated
    },
    meta
  });

  return updated;
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
  },
  navigation
}) {
  yield call(validateSaga, modelDefinition, meta); // Forwarding thrown error(s) to the parent saga.

  const instance = yield call(updateSaga, modelDefinition, meta); // Forwarding thrown error(s) to the parent saga.

  if (afterAction === AFTER_ACTION_NEW) {
    try {
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
      })
    } catch (err) {
      throw err;
    }
  } else if (afterAction === AFTER_ACTION_NEXT) {
    try {
      const { offset: navOffset, nextInc } = navigation;

      let { i, init } = nextInc.next({ i: 1 }).value

      if (init) {
        i = nextInc.next({ i: 1 }).value.i
      }

      const offset = navOffset + i;

      const { instances, totalCount, offset: newOffset } = yield call(searchSaga, {
        modelDefinition,
        action: {
          payload: {
            offset
          },
          meta
        }
      });

      try {
        yield call(editSaga, {
          modelDefinition,
          action: {
            payload: {
              instance: instances.length === 0 ? instance : instances[0],
              navigation: {
                ...navigation,
                offset: newOffset,
                totalCount,
                ...(instances.length === 0 ? { error: ERROR_NOT_FOUND } : {})
              }
            },
            meta
          }
        });
      } catch (err) {
        throw err;
      }
    } catch (err) {
      throw err;
    }
  }
}
