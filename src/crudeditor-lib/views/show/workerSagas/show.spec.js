import { call, put, select, all } from 'redux-saga/effects';
import 'regenerator-runtime/runtime'
import assert from 'assert'

import { VIEW_SEARCH } from '../../../common/constants';
import showSaga from './show';

import {
  INSTANCE_SHOW_FAIL,
  INSTANCE_SHOW_REQUEST,
  INSTANCE_SHOW_SUCCESS
} from '../constants';

describe('show: show saga', () => {
  const arg = {
    modelDefinition: { api: { get: _ => null } },
    softRedirectSaga: _ => null,
    action: {
      payload: { instance: {
        name: "someName"
      } },
      meta: { source: {} }
    }
  }

  const gen = showSaga(arg);

  it('should dispatch INSTANCE_SHOW_REQUEST', () => {
    assert.deepEqual(
      gen.next().value,
      put({
        type: INSTANCE_SHOW_REQUEST,
        meta: { source: {} }
      })
    );
  });

  it('should call arg.modelDefinition.api.get', () => {
    assert.deepEqual(
      gen.next().value,
      call(arg.modelDefinition.api.get, arg.action.payload)
    );
  });

  it('should dispatch INSTANCE_SHOW_SUCCESS', () => {
    assert.deepEqual(
      gen.next().value,
      put({
        type: INSTANCE_SHOW_SUCCESS,
        payload: { instance: undefined },
        meta: { source: {} }
      })
    );
  });

  it('should end iterator', () => {
    assert.deepEqual(
      gen.next(),
      { done: true, value: undefined }
    );
  });
});
