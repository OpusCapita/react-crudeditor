import { call, put, select } from 'redux-saga/effects';
import { delay } from 'redux-saga';

import searchSaga from '../../search/workerSagas/search';
import editSaga from './edit';
import { VIEW_CREATE, VIEW_SEARCH } from '../../../common/constants';

import {
  AFTER_ACTION_NEXT,
  AFTER_ACTION_NEW,

  VIEW_REDIRECT_REQUEST,
  VIEW_REDIRECT_FAIL,

  INSTANCE_FIELD_VALIDATE,

  INSTANCE_SAVE_REQUEST,
  INSTANCE_SAVE_FAIL,
  INSTANCE_SAVE_SUCCESS,

  INSTANCE_VALIDATE_REQUEST,
  INSTANCE_VALIDATE_FAIL,
  INSTANCE_VALIDATE_SUCCESS,

  VIEW_NAME
} from '../constants';

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
  }
}) {
  yield call(validateSaga, modelDefinition, meta); // Forwarding thrown error(s) to the parent saga.

  const instance = yield call(updateSaga, modelDefinition, meta); // Forwarding thrown error(s) to the parent saga.

  if (afterAction === AFTER_ACTION_NEW) {

    yield call(delay, 1000)

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
    // retrieve search params
    const filter = yield select(storeState => storeState.views[VIEW_SEARCH].resultFilter);
    const { field: sort, order } = yield select(storeState => storeState.views[VIEW_SEARCH].sortParams);
    const { offset } = yield select(storeState => storeState.views[VIEW_SEARCH].pageParams);

    try {
      const instances = yield call(searchSaga, {
        modelDefinition,
        action: {
          payload: {
            filter,
            sort,
            order,
            max: -1,
            offset,
            nextTo: instance
          },
          meta
        }
      });

      const nextInstance = instances[0];

      try {
        yield call(editSaga, {
          modelDefinition,
          action: {
            payload: {
              instance: nextInstance
            },
            meta
          }
        });
      } catch (err) {
        throw err;
      }
    } catch (err) {
      throw err; // Initialization error(s) are forwarded to the parent saga.
    }
  }
}
