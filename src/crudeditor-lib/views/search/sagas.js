import { put, takeLatest, all, select } from 'redux-saga/effects';

import {
  INSTANCES_DELETE,
  INSTANCES_DELETE_FAIL,
  INSTANCES_DELETE_REQUEST,
  INSTANCES_DELETE_SUCCESS,

  INSTANCES_SEARCH,
  INSTANCES_SEARCH_FAIL,
  INSTANCES_SEARCH_REQUEST,
  INSTANCES_SEARCH_SUCCESS
} from './constants';

import {
  getResultFilter,
  getSortField,
  getSortOrder,
  getPageMax,
  getPageOffset,
  getIdField
} from './selectors';

function* onInstancesSearch(entityConfiguration, {
  payload: {
    filter,
    sort,
    order,
    max,
    offset
  },
  meta: { source }
}) {
  filter = filter || (yield select(getResultFilter, entityConfiguration));
  sort   = sort   || (yield select(getSortField, entityConfiguration));
  order  = order  || (yield select(getSortOrder, entityConfiguration));
  max    = max    || (yield select(getPageMax, entityConfiguration));

  offset = offset || offset === 0 ?
    offset :
    (yield select(getPageOffset, entityConfiguration));

  yield put({
    type: INSTANCES_SEARCH_REQUEST,
    meta: { source }
  });

  try {
    const { instances, totalCount } = yield call(entityConfiguration.api.search, {
      filter,  // TODO: remove "" and undefined from filter just like in detailedFilter2briefFilter
      sort,
      order,
      max,
      offset
    });

    yield put({
      type: INSTANCES_SEARCH_SUCCESS,
      payload: {
        instances,
        totalCount,
        filter,
        sort,
        order,
        max,
        offset
      },
      meta: { source }
    });
  } catch (err) {
    yield put({
      type: INSTANCES_SEARCH_FAIL,
      payload: err,
      error: true,
      meta: { source }
    });
  }
}

function* onInstancesDelete(entityConfiguration, {
  payload: { instances }
}) {
  const idFieldName = yield select(getIdField, entityConfiguration);

  yield put({
    type: INSTANCES_DELETE_REQUEST
  });

  try {
    const { deletedCount } = yield call(
      entityConfiguration.api.delete,
      instances.map(instance => instance[idFieldName])
    );

    yield put({
      type: INSTANCES_DELETE_SUCCESS,
      payload: { instances }
    });
  } catch (err) {
    yield put({
      type: INSTANCES_DELETE_FAIL,  // TODO: handle error
      payload: err,
      error: true
    });
  }
}

export default function*(entityConfiguration) {
  yield all([
    takeLatest(INSTANCES_SEARCH, onInstancesSearch, entityConfiguration),
    takeEvery(INSTANCES_DELETE,  onInstancesDelete, entityConfiguration)
  ]);
}
