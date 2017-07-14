import { call, put, takeLatest, takeEvery, all, select } from 'redux-saga/effects';

import {
  EMPTY_FILTER_VALUE,

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
  getPageMax,
  getPageOffset,
  getResultFilter,
  getResultInstances,
  getSortField,
  getSortOrder
} from './selectors';

import { searchInstances } from './actions';
import { selectors as commonSelectors } from '../../common';

const { getIdField } = commonSelectors;

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

  const currentSort = yield select(getSortField, entityConfiguration);
  const currentOrder = yield select(getSortOrder, entityConfiguration);

  sort   = sort  || currentSort;
  order  = order || currentOrder;
  max    = max   || (yield select(getPageMax, entityConfiguration));

  offset = sort === currentSort && order === currentOrder ?
    (offset || offset === 0 ?
      offset :
      (yield select(getPageOffset, entityConfiguration))
    ) :
    0;

  yield put({
    type: INSTANCES_SEARCH_REQUEST,
    meta: { source }
  });

  try {
    const { instances, totalCount } = yield call(entityConfiguration.api.search, {
      filter: filter && Object.keys(filter).every(field => filter[field] === EMPTY_FILTER_VALUE) ?
        undefined :  // this option is also triggered when filter === {}
        filter,
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
  const idField = yield select(getIdField, entityConfiguration);

  yield put({
    type: INSTANCES_DELETE_REQUEST
  });

  try {
    const { deletedCount } = yield call(
      entityConfiguration.api.delete,
      instances.map(instance => instance[idField])
    );

    yield put({
      type: INSTANCES_DELETE_SUCCESS,
      payload: { instances }
    });

    const resultInstances = yield select(getResultInstances, entityConfiguration);
    let searchParams;

    if (resultInstances.length === 0) {
      const offset = yield select(getPageOffset, entityConfiguration);

      if (offset !== 0) {
        searchParams = {
          offset: offset - (yield select(getPageMax, entityConfiguration))
        };
      }
    }

    yield put(searchInstances(searchParams));
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
