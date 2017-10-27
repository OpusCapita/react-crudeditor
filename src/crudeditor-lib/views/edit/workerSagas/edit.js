import { call, put } from 'redux-saga/effects';

import { getLogicalKeyBuilder } from '../../lib';
import searchNext from './searchNext';

import {
  INSTANCE_EDIT_FAIL,
  INSTANCE_EDIT_REQUEST,
  INSTANCE_EDIT_SUCCESS
} from '../constants';

/*
 * XXX: in case of failure, a worker saga must dispatch an appropriate action and exit by throwing error(s).
 */
export default function*({
  modelDefinition,
  action: {
    payload: {
      instance,
      referer
    },
    meta
  }
}) {
  yield put({
    type: INSTANCE_EDIT_REQUEST,
    meta
  });

  let persistentInstance;

  try {
    persistentInstance = yield call(modelDefinition.api.get, {
      instance: getLogicalKeyBuilder(modelDefinition.model.fields)(instance)
    });
  } catch (err) {
    yield put({
      type: INSTANCE_EDIT_FAIL,
      payload: err,
      error: true,
      meta
    });

    throw err;
  }

  // check if we need to display 'saveAndNext' button
  // this is true, if:
  // - referer === 'search' &&
  // there is actual instance available on the backend
  // (e.g. for the last instance this button should not be displayed)
  let showSaveAndNext = false;

  if (referer === 'search') {
    try {
      // make a request to find out if the next instance exists
      const nextInstance = yield call(searchNext, {
        modelDefinition,
        meta,
        instance: persistentInstance
      })

      if (nextInstance) {
        showSaveAndNext = true;
      }
    } catch (err) {
      throw err;
    }
  }

  yield put({
    type: INSTANCE_EDIT_SUCCESS,
    payload: {
      instance: persistentInstance,
      showSaveAndNext
    },
    meta
  });
}
