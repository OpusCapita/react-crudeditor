import { call, put, select } from 'redux-saga/effects';
import redirectSaga from '../../../common/workerSagas/redirect';
import validateSaga from '../../../common/workerSagas/validate';
import saveSaga from '../../../common/workerSagas/save';
import { getDefaultNewInstance } from '../../search/selectors';
import { isAllowed } from '../../../lib';
import { VIEW_ERROR, VIEW_EDIT, VIEW_SHOW, PERMISSION_EDIT } from '../../../common/constants';
import { AFTER_ACTION_NEW, VIEW_INITIALIZE, VIEW_NAME } from '../constants';

/*
 * XXX: in case of failure, a worker saga must dispatch an appropriate action and exit by throwing error(s).
 */
export default function*({
  modelDefinition,
  softRedirectSaga,
  action: {
    payload: /* istanbul ignore next */ { afterAction } = {},
    meta
  }
}) {
  // Forwarding thrown error(s) to the parent saga.
  yield call(validateSaga, { modelDefinition, meta, viewName: VIEW_NAME });

  const savedInstance = yield call(saveSaga, { modelDefinition, meta, viewName: VIEW_NAME });

  if (afterAction === AFTER_ACTION_NEW) {
    // create another instance
    yield put({
      type: VIEW_INITIALIZE,
      payload: {
        predefinedFields: yield select(storeState => getDefaultNewInstance(storeState, modelDefinition))
      },
      meta
    });
  } else {
    try {
      const tab = yield select(storeState => storeState.views[VIEW_NAME].activeTab);

      yield call(redirectSaga, {
        modelDefinition,
        softRedirectSaga,
        action: {
          payload: {
            view: {
              name: /* istanbul ignore next */ isAllowed(
                modelDefinition.permissions.crudOperations,
                PERMISSION_EDIT,
                { instance: savedInstance }
              ) ?
                VIEW_EDIT :
                VIEW_SHOW,
              state: {
                instance: savedInstance,
                tab: tab && tab.tab
              }
            }
          },
          meta
        }
      })
    } catch (err) {
      /* istanbul ignore next */
      yield call(softRedirectSaga, {
        viewName: VIEW_ERROR,
        viewState: err
      });
    }
  }
}
