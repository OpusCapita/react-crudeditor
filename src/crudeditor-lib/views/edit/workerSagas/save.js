import { call, put, select } from 'redux-saga/effects';

import editSaga from './edit';
import searchSaga from '../../search/workerSagas/search';

import { VIEW_CREATE, ERROR_NOT_FOUND } from '../../../common/constants';

import {
  AFTER_ACTION_NEXT,
  AFTER_ACTION_NEW,

  VIEW_REDIRECT_REQUEST,
  VIEW_REDIRECT_FAIL,

  INSTANCE_SAVE_REQUEST,
  INSTANCE_SAVE_FAIL,
  INSTANCE_SAVE_SUCCESS,

  INSTANCE_VALIDATE_REQUEST,
  INSTANCE_VALIDATE_FAIL,
  INSTANCE_VALIDATE_SUCCESS,

  ALL_INSTANCE_FIELDS_VALIDATE_FAIL,

  VIEW_NAME
} from '../constants';

/*
 * Instance validation
 */
function* validateSaga(modelDefinition, meta) {
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
    yield put({
      type: ALL_INSTANCE_FIELDS_VALIDATE_FAIL,
      payload: fieldErrors
    });
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
    yield put({
      type: VIEW_REDIRECT_REQUEST,
      meta
    });

    try {
      yield call(softRedirectSaga, {
        viewName: VIEW_CREATE,
        viewState: {
          instance: {} // TODO: build correct pre-filled instance.
        }
      });
    } catch (err) {
      yield put({
        type: VIEW_REDIRECT_FAIL,
        payload: err,
        error: true,
        meta
      });

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
