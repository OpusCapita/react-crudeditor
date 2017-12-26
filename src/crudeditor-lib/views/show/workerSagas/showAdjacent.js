import { call, select, put } from 'redux-saga/effects';

import showSaga from './show';
import searchSaga from '../../search/workerSagas/search';

import {
  VIEW_NAME,
  ADJACENT_INSTANCE_SHOW_FAIL
} from '../constants';

export default function*({
  modelDefinition,
  action: {
    payload: { step },
    meta
  }
}) {
  // XXX: error(s) thrown in called below sagas are forwarded to the parent saga. Use try..catch to alter this default.

  const previousOffset = yield select(storeState => storeState.views[VIEW_NAME].offset);

  const offset = previousOffset + step;

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
    yield call(showSaga, {
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
      type: ADJACENT_INSTANCE_SHOW_FAIL,
      meta
    });
  }
}
