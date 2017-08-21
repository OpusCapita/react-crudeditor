import { call, put, takeLatest, takeEvery, all, select } from 'redux-saga/effects';

import { UNINITIALIZED as VIEW_SEARCH_UNINITIALIZED } from '../views/search/constants';
import { searchInstances } from '../views/search/actions';
import { createInstance } from '../views/create/actions';
import { editInstance } from '../views/edit/actions';
//import { showInstance } from '../views/show/actions';

import {
  INSTANCES_DELETE,
  INSTANCES_DELETE_FAIL,
  INSTANCES_DELETE_REQUEST,
  INSTANCES_DELETE_SUCCESS,

  VIEW_SEARCH,
  VIEW_CREATE,
  VIEW_EDIT,
  VIEW_SHOW,
  DEFAULT_VIEW,
  VIEW_INITIALIZE
} from './constants';

/*███████████████████*\
 *███ WORKER SAGA ███*
\*███████████████████*/

function* onViewInitialize(modelDefinition, {
  payload: {
    viewName,
    viewState
  },
  meta: {
    source
  }
}) {
  viewName = viewName || DEFAULT_VIEW;

  const actionCreator = (
    viewName === VIEW_SEARCH && searchInstances ||
    viewName === VIEW_CREATE && createInstance  ||
    viewName === VIEW_EDIT   && editInstance
    //viewName === VIEW_SHOW   && showInstance
  );

  if (!actionCreator) {
    throw new Error('Unknown view ' + viewName);
  }

  // ask specific view to process new input and
  // if success display the view, otherwise display error page.
  yield put(actionCreator(viewState, source));
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
    takeLatest(VIEW_INITIALIZE, onViewInitialize, modelDefinition),  // TODO: cancel all running sagas.
    takeEvery(INSTANCES_DELETE,  onInstancesDelete, modelDefinition)
  ]);
}
