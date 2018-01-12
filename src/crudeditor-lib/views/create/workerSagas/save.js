import { call, put, select } from 'redux-saga/effects';

import {
  AFTER_ACTION_NEW,

  ALL_INSTANCE_FIELDS_VALIDATE,

  INSTANCE_SAVE_REQUEST,
  INSTANCE_SAVE_FAIL,
  INSTANCE_SAVE_SUCCESS,

  INSTANCE_VALIDATE_REQUEST,
  INSTANCE_VALIDATE_FAIL,
  INSTANCE_VALIDATE_SUCCESS,

  VIEW_INITIALIZE,
  VIEW_NAME
} from '../constants';

import { VIEW_ERROR, VIEW_EDIT, VIEW_SHOW } from '../../../common/constants';
import redirectSaga from '../../../common/workerSagas/redirect';
import { getDefaultNewInstance } from '../../search/selectors';

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
    payload: /* istanbul ignore next */ { afterAction } = {},
    meta
  }
}) {
  yield call(validateSaga, modelDefinition, meta); // Forwarding thrown error(s) to the parent saga.

  const savedInstance = yield call(saveSaga, modelDefinition, meta);

  if (afterAction === AFTER_ACTION_NEW) {
    // create another instance
    yield put({
      type: VIEW_INITIALIZE,
      payload: {
        predefinedFields: yield select(storeState => getDefaultNewInstance(storeState, modelDefinition))
      },
      meta
    });
  } else {
    try {
      const tab = yield select(storeState => storeState.views[VIEW_NAME].activeTab);

      yield call(redirectSaga, {
        modelDefinition,
        softRedirectSaga,
        action: {
          payload: {
            view: {
              name: /* istanbul ignore next */ modelDefinition.permissions.crudOperations.edit ?
                VIEW_EDIT :
                VIEW_SHOW,
              state: {
                instance: savedInstance,
                tab: tab && tab.tab
              }
            }
          },
          meta
        }
      })
    } catch (err) {
      /* istanbul ignore next */
      yield call(softRedirectSaga, {
        viewName: VIEW_ERROR,
        viewState: err
      });
    }
  }
}
