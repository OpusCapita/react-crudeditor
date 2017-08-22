import isEqual from 'lodash/isEqual';
import { call, put, takeLatest, all, select } from 'redux-saga/effects';

import { buildDefaultStoreState } from './reducer';

import {
  EMPTY_FILTER_VALUE,

  INSTANCES_SEARCH,
  INSTANCES_SEARCH_FAIL,
  INSTANCES_SEARCH_REQUEST,
  INSTANCES_SEARCH_SUCCESS,

  READY,
  VIEW_NAME
} from './constants';

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

  if (source === 'owner') {
    // Default search values are default values for the arguments in case of external searchInstances() call.
    const {
      resultFilter: defaultFilter,
      sortParams: {
        field: defaultSort,
        order: defaultOrder
      },
      pageParams: {
        max: defaultMax,
        offset: defaultOffset
      }
    } = buildDefaultStoreState(modelDefinition.ui.search);

    filter = filter || defaultFilter;
    sort   = sort   || defaultSort;
    order  = order  || defaultOrder;
    max    = max    || defaultMax;
    offset = offset || defaultOffset;

    if (
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
  } else {
    // Current values are default values for the arguments in case of internal searchInstances() call.
    filter = filter || currentFilter;
    sort   = sort   || currentSort;
    order  = order  || currentOrder;
    max    = max    || currentMax;

    // Reset offset to 0 with new sortField, sortOrder, pageMax or filter.
    offset = sort === currentSort &&
      order === currentOrder &&
      max === currentMax &&
      isEqual(JSON.parse(JSON.stringify(filter)), JSON.parse(JSON.stringify(currentFilter))) ?
        (offset || offset === 0 ? offset : currentOffset) :
        0;
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

/*████████████████████*\
 *███ WATCHER SAGA ███*
\*████████████████████*/

export default function*(modelDefinition) {
  yield all([
    takeLatest(INSTANCES_SEARCH, onInstancesSearch, modelDefinition)
  ]);
}
