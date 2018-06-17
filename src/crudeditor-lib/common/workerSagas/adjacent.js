import { call, select, put } from 'redux-saga/effects';
import redirectSaga from './redirect';
import showSaga from '../../views/show/workerSagas/show';
import editSaga from '../../views/edit/workerSagas/edit';
import searchSaga from '../../views/search/workerSagas/search';
import { ADJACENT_INSTANCE_EDIT_FAIL } from '../../views/edit/constants';
import { ADJACENT_INSTANCE_SHOW_FAIL } from '../../views/show/constants';
import { PERMISSION_EDIT, VIEW_EDIT, VIEW_SHOW } from '../constants';
import { isAllowed } from '../../lib';

const ADJACENT_INSTANCE_FAIL = {
  [VIEW_SHOW]: ADJACENT_INSTANCE_SHOW_FAIL,
  [VIEW_EDIT]: ADJACENT_INSTANCE_EDIT_FAIL
}

export default function*({
  modelDefinition,
  softRedirectSaga,
  action: {
    payload: { step },
    meta
  }
}) {
  // XXX: error(s) thrown in called below sagas are forwarded to the parent saga. Use try..catch to alter this default.

  const viewName = meta.spawner;
  const currentOffset = yield select(storeState => storeState.views[viewName].offset);
  const offset = currentOffset + step;

  const [instance] = yield call(searchSaga, {
    modelDefinition,
    action: {
      payload: {
        offset,
        max: 1
      },
      meta
    }
  });

  if (!instance) {
    yield put({
      type: ADJACENT_INSTANCE_FAIL[viewName],
      meta
    });

    return;
  }

  const { crudOperations } = modelDefinition.permissions;
  const canEdit = isAllowed(crudOperations, PERMISSION_EDIT, { instance });

  if ((canEdit && viewName === VIEW_EDIT) || (!canEdit && viewName === VIEW_SHOW)) {
    // stay on current view
    yield call(canEdit ? editSaga : showSaga, {
      modelDefinition,
      action: {
        payload: {
          instance,
          offset
        },
        meta
      }
    });
  } else {
    // if 'edit' permission contradicts current view than redirect to appropriate view
    yield call(redirectSaga, {
      modelDefinition,
      softRedirectSaga,
      action: {
        payload: {
          view: {
            name: canEdit ? VIEW_EDIT : VIEW_SHOW,
            state: {
              instance,
              tab: yield select(storeState => storeState.views[viewName].activeTab.tab)
            }
          },
          offset
        },
        meta
      }
    });
  }
}
