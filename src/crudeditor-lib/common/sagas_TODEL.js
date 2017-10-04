import { call, put, takeEvery, select } from 'redux-saga/effects';

import { UNINITIALIZED as VIEW_SEARCH_UNINITIALIZED } from '../views/search/constants';
import { searchInstances } from '../views/search/actions';

import {
  INSTANCES_DELETE,
  INSTANCES_DELETE_FAIL,
  INSTANCES_DELETE_REQUEST,
  INSTANCES_DELETE_SUCCESS,

  VIEW_SEARCH
} from './constants';

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
      (yield select(storeState => storeState.views[VIEW_SEARCH].status)) !== VIEW_SEARCH_UNINITIALIZED &&
      (yield select(storeState => storeState.views[VIEW_SEARCH].resultInstances)).length === 0
    ) {
      // Search View was visited before and all displayed instances have just been deleted => page change may be needed.
      const offset = yield select(storeState => storeState.views[VIEW_SEARCH].pageParams.offset);

      if (offset !== 0 && offset >= (yield select(storeState => storeState.views[VIEW_SEARCH].totalCount))) {
        // All instances on the last page have been deleted => going to the previous page
        searchParams = {
          offset: offset - (yield select(storeState => storeState.views[VIEW_SEARCH].pageParams.max))
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
    takeEvery(INSTANCES_DELETE,  onInstancesDelete, modelDefinition)
  ]);
}
