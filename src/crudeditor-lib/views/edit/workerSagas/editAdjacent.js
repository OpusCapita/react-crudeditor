import { call, select, put } from 'redux-saga/effects';

import editSaga from './edit';
import searchSaga from '../../search/workerSagas/search';

import {
  VIEW_NAME,
  ADJACENT_INSTANCE_EDIT_FAIL
} from '../constants';

export default function*({
  modelDefinition,
  action: {
    payload: { step },
    meta
  }
}) {
  // XXX: error(s) thrown in called below sagas are forwarded to the parent saga. Use try..catch to alter this default.

  const offset = step + (yield select(storeState => storeState.views[VIEW_NAME].offset));

  const [instance] = yield call(searchSaga, {
    modelDefinition,
    action: {
      payload: {
        offset,
        max: 1
      },
      meta
    }
  });

  if (instance) {
    yield call(editSaga, {
      modelDefinition,
      action: {
        payload: {
          instance,
          offset
        },
        meta
      }
    });
  } else {
    yield put({
      type: ADJACENT_INSTANCE_EDIT_FAIL,
      meta
    });
  }
}
