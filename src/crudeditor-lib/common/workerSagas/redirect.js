import { call, put } from 'redux-saga/effects';

import {
  VIEW_SEARCH,
  VIEW_CREATE,
  VIEW_EDIT,
  VIEW_SHOW,
  VIEW_ERROR
} from '../constants';

import {
  VIEW_REDIRECT_REQUEST as SEARCH_VIEW_REDIRECT_REQUEST,
  VIEW_REDIRECT_FAIL as SEARCH_VIEW_REDIRECT_FAIL
} from '../../views/search/constants';

import {
  VIEW_REDIRECT_REQUEST as CREATE_VIEW_REDIRECT_REQUEST,
  VIEW_REDIRECT_FAIL as CREATE_VIEW_REDIRECT_FAIL
} from '../../views/create/constants';

import {
  VIEW_REDIRECT_REQUEST as EDIT_VIEW_REDIRECT_REQUEST,
  VIEW_REDIRECT_FAIL as EDIT_VIEW_REDIRECT_FAIL
} from '../../views/edit/constants';

import {
  VIEW_REDIRECT_REQUEST as SHOW_VIEW_REDIRECT_REQUEST,
  VIEW_REDIRECT_FAIL as SHOW_VIEW_REDIRECT_FAIL
} from '../../views/show/constants';

import {
  VIEW_REDIRECT_REQUEST as ERROR_VIEW_REDIRECT_REQUEST,
  VIEW_REDIRECT_FAIL as ERROR_VIEW_REDIRECT_FAIL
} from '../../views/error/constants';

const VIEW_REDIRECT_REQUEST = {
  [VIEW_SEARCH]: SEARCH_VIEW_REDIRECT_REQUEST,
  [VIEW_CREATE]: CREATE_VIEW_REDIRECT_REQUEST,
  [VIEW_EDIT]: EDIT_VIEW_REDIRECT_REQUEST,
  [VIEW_SHOW]: SHOW_VIEW_REDIRECT_REQUEST,
  [VIEW_ERROR]: ERROR_VIEW_REDIRECT_REQUEST
};

const VIEW_REDIRECT_FAIL = {
  [VIEW_SEARCH]: SEARCH_VIEW_REDIRECT_FAIL,
  [VIEW_CREATE]: CREATE_VIEW_REDIRECT_FAIL,
  [VIEW_EDIT]: EDIT_VIEW_REDIRECT_FAIL,
  [VIEW_SHOW]: SHOW_VIEW_REDIRECT_FAIL,
  [VIEW_ERROR]: ERROR_VIEW_REDIRECT_FAIL
};

/*
 * XXX: in case of failure, a worker saga must dispatch an appropriate action and exit by throwing error(s).
 */
export default function*({
  modelDefinition,
  softRedirectSaga,
  action: {
    payload: {
      view: {
        name: viewName,
        state: viewState
      },
      ...additionalArgs
    },
    meta
  }
}) {
  yield put({
    type: VIEW_REDIRECT_REQUEST[meta.spawner],
    meta
  });

  try {
    yield call(softRedirectSaga, {
      viewName,
      viewState,
      ...additionalArgs
    });
  } catch (err) {
    yield put({
      type: VIEW_REDIRECT_FAIL[meta.spawner],
      payload: err,
      error: true,
      meta
    });

    throw err;
  }
}
