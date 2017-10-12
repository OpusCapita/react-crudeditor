import { put } from 'redux-saga/effects';
import 'regenerator-runtime/runtime'
import assert from 'assert'

import createSaga from './create';

import {
  INSTANCE_CREATE_REQUEST,
  INSTANCE_CREATE_SUCCESS
} from '../constants';

describe('create view: create saga', () => {
  const arg = {
    modelDefinition: {
      api: { get: _ => null },
      model: {
        fields: []
      }
    },
    softRedirectSaga: _ => null,
    action: {
      payload: { predefinedFields: {
        description: "mydesc"
      } },
      meta: { source: {} }
    }
  }

  const gen = createSaga(arg);

  it('should dispatch INSTANCE_CREATE_REQUEST', () => {
    assert.deepEqual(
      gen.next().value,
      put({
        type: INSTANCE_CREATE_REQUEST,
        meta: { source: {} }
      })
    );
  });

  it('should dispatch INSTANCE_CREATE_SUCCESS', () => {
    assert.deepEqual(
      gen.next().value,
      put({
        type: INSTANCE_CREATE_SUCCESS,
        payload: arg.action.payload,
        meta: arg.action.meta
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
