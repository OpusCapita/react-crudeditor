import { call, put, takeLatest, takeEvery, all, select } from 'redux-saga/effects';

import {
  INSTANCE_EDIT,
  INSTANCE_EDIT_FAIL,
  INSTANCE_EDIT_REQUEST,
  INSTANCE_EDIT_SUCCESS
} from './constants';

function* onInstanceEdit(entityConfiguration, {
  payload: {
    id,
    tab = 0
  },
  meta: { source }
}) {
  yield put({
    type: INSTANCE_EDIT_REQUEST,
    meta: { source }
  });

  try {
    const { instance } = yield call(entityConfiguration.api.get, id);

    yield put({
      type: INSTANCE_EDIT_SUCCESS,
      payload: {
        instance,
        tab
      },
      meta: { source }
    });
  } catch (err) {
    yield put({
      type: INSTANCE_EDIT_FAIL,
      payload: err,
      error: true,
      meta: { source }
    });
  }
}

export default function*(entityConfiguration) {
  yield all([
    takeEvery(INSTANCE_EDIT,  onInstanceEdit, entityConfiguration)
  ]);
}
