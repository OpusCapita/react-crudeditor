import isEqual from 'lodash/isEqual';
import { call, put, takeLatest, all, select } from 'redux-saga/effects';

import { buildDefaultStoreState } from './reducer';

import {
  FORM_FILTER_PARSE,

  INSTANCES_SEARCH,
  INSTANCES_SEARCH_FAIL,
  INSTANCES_SEARCH_REQUEST,
  INSTANCES_SEARCH_SUCCESS,

  RANGE_FIELD_TYPES,
  READY,
  VIEW_NAME
} from './constants';

import { EMPTY_FIELD_VALUE } from '../../common/constants';

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
  const cleanValue = ({ name, value }) => {
    if (!RANGE_FIELD_TYPES.includes(modelDefinition.model.fields[name].type)) {
      return value !== EMPTY_FIELD_VALUE && {
        [name]: value
      }
    }

    const valueCleansed = {};

    if (value.from !== EMPTY_FIELD_VALUE) {
      valueCleansed.from = value.from;
    }

    if (value.to !== EMPTY_FIELD_VALUE) {
      valueCleansed.to = value.to;
    }

    return Object.keys(valueCleansed).length && {
      [name]: valueCleansed
    };
  }

  const cleanFilter = filter => Object.keys(filter).reduce(
    (rez, name) => {
      const valueCleansed = cleanValue({
        name,
        value: filter[name]
      });

      return valueCleansed ? {
        ...(rez || {}),
        ...valueCleansed
      } :
        rez;
    },
    undefined
  );

  const divergedField = yield select(storeState => storeState.views[VIEW_NAME].divergedField);

  if (divergedField) {
    yield put({
      type: FORM_FILTER_PARSE,
      payload: {
        name: divergedField
      },
      meta: { source }
    });

    if (filter) {
      filter = yield select(storeState => storeState.views[VIEW_NAME].formFilter);
    }
  }

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
    return;
  }

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
    } = buildDefaultStoreState(modelDefinition);

    filter = filter || defaultFilter;
    sort   = sort   || defaultSort;
    order  = order  || defaultOrder;
    max    = max    || defaultMax;
    offset = offset || defaultOffset;

    if (
      isEqual(cleanFilter(filter), cleanFilter(currentFilter)) &&
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
      isEqual(cleanFilter(filter), cleanFilter(currentFilter)) ?
        (offset || offset === 0 ? offset : currentOffset) :
        0;
  }

  yield put({
    type: INSTANCES_SEARCH_REQUEST,
    meta: { source }
  });

  try {
    const { instances, totalCount } = yield call(modelDefinition.api.search, {
      filter: cleanFilter(filter),
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
