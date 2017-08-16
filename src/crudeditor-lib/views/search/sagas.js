import isEqual from 'lodash/isEqual';
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
  INSTANCES_SEARCH_SUCCESS,

  UNINITIALIZED,
  READY,
  VIEW_NAME
} from './constants';

import { searchInstances } from './actions';

/*███████████████████*\
 *███ WORKER SAGA ███*
\*███████████████████*/

export function* onInstancesSearch(modelDefinition, {
  payload: {
    filter,
    sort,
    order,
    max,
    offset
  },
  meta: { source }
}) {
  const [
    currentFilter,
    currentSort,
    currentOrder,
    currentMax,
    currentOffset
  ] = yield select(({
    views: {
      [VIEW_NAME]: {
        resultFilter,
        sortParams: {
          field,
          order
        },
        pageParams: {
          max,
          offset
        }
      }
    }
  }) => [
    resultFilter,
    field,
    order,
    max,
    offset
  ]);

  filter = filter || currentFilter;
  sort   = sort   || currentSort;
  order  = order  || currentOrder;
  max    = max    || currentMax;

  offset = sort === currentSort &&
    order === currentOrder &&
    max === currentMax &&
    isEqual(JSON.parse(JSON.stringify(filter)), JSON.parse(JSON.stringify(currentFilter))) ?
      (offset || offset === 0 ? offset : currentOffset) :
      0;

  if (source === 'owner' &&
    isEqual(JSON.parse(JSON.stringify(filter)), JSON.parse(JSON.stringify(currentFilter))) &&
    sort === currentSort &&
    order === currentOrder &&
    max === currentMax &&
    offset === currentOffset &&
    (yield select(storeState => storeState.views[VIEW_NAME].status)) === READY &&
    (yield select(storeState => storeState.common.activeViewName)) === VIEW_NAME
  ) {  // Prevent duplicate API call when view name/state props are received in response to onTransition({name,state}) call.
    return;
  }

  yield put({
    type: INSTANCES_SEARCH_REQUEST,
    meta: { source }
  });

  try {
    const { instances, totalCount } = yield call(modelDefinition.api.search, {
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

/*███████████████████*\
 *███ WORKER SAGA ███*
\*███████████████████*/

export function* onInstancesDelete(modelDefinition, {
  payload: { instances }
}) {
  yield put({
    type: INSTANCES_DELETE_REQUEST
  });

  try {
    const { deletedCount } = yield call(
      modelDefinition.api.delete,
      { instances }
    );

    yield put({
      type: INSTANCES_DELETE_SUCCESS,
      payload: { instances }
    });

    let searchParams;

    if (
      (yield select(storeState => storeState.views[VIEW_NAME].status)) !== UNINITIALIZED &&
      (yield select(storeState => storeState.views[VIEW_NAME].resultInstances)).length === 0
    ) {
      const offset = yield select(storeState => storeState.views[VIEW_NAME].pageParams.offset);

      if (offset !== 0 && offset >= (yield select(storeState => storeState.views[VIEW_NAME].totalCount))) {
        // All instances on the last page have been deleted => going to the previous page
        searchParams = {
          offset: offset - (yield select(storeState => storeState.views[VIEW_NAME].pageParams.max))
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

/*████████████████████*\
 *███ WATCHER SAGA ███*
\*████████████████████*/

export default function*(modelDefinition) {
  yield all([
    takeLatest(INSTANCES_SEARCH, onInstancesSearch, modelDefinition),
    takeEvery(INSTANCES_DELETE,  onInstancesDelete, modelDefinition)
  ]);
}
