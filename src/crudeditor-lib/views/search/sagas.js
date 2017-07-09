import { put, takeLatest, all, select } from 'redux-saga/effects';

import {
  INSTANCES_SEARCH,
  INSTANCES_SEARCH_REQUEST,
  INSTANCES_SEARCH_SUCCESS,
  INSTANCES_SEARCH_FAIL
} from './constants';

import {
  getResultFilter,
  getSortField,
  getSortOrder,
  getPageMax,
  getPageOffset
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
  filter = filter || (yield select(getResultFilter));
  sort   = sort   || (yield select(getSortField));
  order  = order  || (yield select(getSortOrder));
  max    = max    || (yield select(getPageMax));

  offset = offset || offset === 0 ?
    offset :
    (yield select(getPageOffset));

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

export default function*(entityConfiguration) {
  yield all([
    takeLatest(INSTANCES_SEARCH, onInstancesSearch, entityConfiguration)
  ]);
}
