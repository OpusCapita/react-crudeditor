import { call, put } from 'redux-saga/effects';

import { VIEW_CREATE } from '../../../common/constants';

import {
  VIEW_REDIRECT_REQUEST,
  VIEW_REDIRECT_FAIL
} from '../constants';

/*
 * XXX: in case of failure, a worker saga must dispatch an appropriate action and exit by throwing error(s).
 */
export default function*({
  modelDefinition,
  softRedirectSaga,
  action: {
    // instance should arrive here from search scenario through create/actions.js/createInstance action
    payload: { instance },
    meta
  }
}) {
  yield put({
    type: VIEW_REDIRECT_REQUEST,
    meta
  });

  console.log("---expect a brand new instance:\n" + JSON.stringify(instance, null, 2) + "\n-------")

  try {
    yield call(softRedirectSaga, {
      viewName: VIEW_CREATE,
      viewState: { instance }
    });
  } catch (err) {
    yield put({
      type: VIEW_REDIRECT_FAIL,
      payload: err,
      error: true,
      meta
    });

    throw err;
  }
}
