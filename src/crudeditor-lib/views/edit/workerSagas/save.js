import { call, select } from 'redux-saga/effects';

import editAdjacentSaga from './editAdjacent';
import redirectSaga from '../../../common/workerSagas/redirect';
import validateSaga from '../../../common/workerSagas/validate';
import updateSaga from '../../../common/workerSagas/save';
import { VIEW_CREATE } from '../../../common/constants';
import { getDefaultNewInstance } from '../../search/selectors';

import {
  AFTER_ACTION_NEXT,
  AFTER_ACTION_NEW,
  VIEW_NAME
} from '../constants';

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

  yield call(validateSaga, { modelDefinition, meta, viewName: VIEW_NAME });
  yield call(updateSaga, { modelDefinition, meta, viewName: VIEW_NAME });

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
