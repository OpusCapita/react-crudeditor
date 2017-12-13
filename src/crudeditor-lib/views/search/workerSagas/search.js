import isEqual from 'lodash/isEqual';
import merge from 'lodash/merge';
import { call, put, select } from 'redux-saga/effects';

import { buildDefaultStoreState } from '../reducer';
import { cleanFilter } from '../lib';

import {
  INSTANCES_SEARCH_FAIL,
  INSTANCES_SEARCH_REQUEST,
  INSTANCES_SEARCH_SUCCESS,

  VIEW_NAME
} from '../constants';

/*
 * XXX: in case of failure, a worker saga must dispatch an appropriate action and exit by throwing error(s).
 */
export default function*({
  modelDefinition,
  action: {
    payload,
    meta = {}
  }
}) {
  let {
    filter,
    sort,
    order,
    max,
    offset
  } = payload;

  const [
    currentFilter,
    currentSort,
    currentOrder,
    currentMax,
    currentOffset,
    errors
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
        },
        errors
      }
    }
  }) => [
    resultFilter,
    field,
    order,
    max,
    offset,
    errors
  ]);

  if (Object.keys(errors.fields).length) {
    throw errors.fields;
  }

  if (meta.source === 'owner') {
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
    } = buildDefaultStoreState(modelDefinition);

    filter = merge(defaultFilter, filter);
    sort = sort || defaultSort;
    order = order || defaultOrder;
    max = max || defaultMax;
    offset = offset || defaultOffset;
  } else {
    // Current values are default values for the arguments in case of internal searchInstances() call.
    filter = filter || currentFilter;
    sort = sort || currentSort;
    order = order || currentOrder;
    max = max || currentMax;

    // Reset offset to 0 with new sortField, sortOrder, pageMax or filter.
    offset = sort === currentSort &&
      order === currentOrder &&
      max === currentMax &&
      isEqual(
        cleanFilter(filter),
        cleanFilter(currentFilter)
      ) ?
      (offset || offset === 0 ? offset : currentOffset) :
      0;
  }

  yield put({
    type: INSTANCES_SEARCH_REQUEST,
    meta
  });

  let instances, totalCount;
  const cleanedFilter = cleanFilter(filter);

  try {
    ({ instances, totalCount } = yield call(modelDefinition.api.search, {
      ...(cleanedFilter ? { filter: cleanedFilter } : null),
      sort,
      order,
      max,
      offset
    }));
  } catch (err) {
    yield put({
      type: INSTANCES_SEARCH_FAIL,
      payload: err,
      error: true,
      meta
    });

    throw err;
  }

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
    meta
  });

  return { instances, totalCount, offset };
}
