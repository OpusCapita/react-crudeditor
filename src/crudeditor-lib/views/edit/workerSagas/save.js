import { call, select } from 'redux-saga/effects';

import adjacentSaga from '../../../common/workerSagas/adjacent';
import redirectSaga from '../../../common/workerSagas/redirect';
import validateSaga from '../../../common/workerSagas/validate';
import updateSaga from '../../../common/workerSagas/save';
import { VIEW_CREATE } from '../../../common/constants';
import { getDefaultNewInstance } from '../../search/selectors';

import {
  AFTER_ACTION_NEXT,
  AFTER_ACTION_NEW
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

  yield call(validateSaga, { modelDefinition, meta });
  yield call(updateSaga, { modelDefinition, meta });

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
    yield call(adjacentSaga, {
      modelDefinition,
      softRedirectSaga,
      action: {
        payload: {
          step: 1
        },
        meta
      }
    });
  }
}
