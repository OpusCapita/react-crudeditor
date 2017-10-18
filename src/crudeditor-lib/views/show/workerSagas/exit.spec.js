import { call, put } from 'redux-saga/effects';
import 'regenerator-runtime/runtime'
import assert from 'assert'

import { VIEW_SEARCH } from '../../../common/constants';
import exitSaga from './exit';

import {
  VIEW_REDIRECT_REQUEST
} from '../constants';

describe('show view: exit saga', () => {
  describe('optimistic path', () => {
    const arg = {
      modelDefinition: {},
      softRedirectSaga: _ => null,
      action: {
        meta: { source: {} }
      }
    }
    const gen = exitSaga(arg);

    it('should dispatch VIEW_REDIRECT_REQUEST', () => {
      assert.deepEqual(
        gen.next().value,
        put({
          type: VIEW_REDIRECT_REQUEST,
          meta: { source: {} }
        })
      );
    });

    it('should call softRedirectSaga', () => {
      assert.deepEqual(
        gen.next().value,
        call(arg.softRedirectSaga, {
          viewName: VIEW_SEARCH
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

  describe('pessimistic path', () => {
    const arg = {
      modelDefinition: {},
      softRedirectSaga: _ => {
        const err = {};
        throw err
      },
      action: {
        meta: { source: {} }
      }
    }
    const gen = exitSaga(arg);

    it('should dispatch VIEW_REDIRECT_REQUEST', () => {
      assert.deepEqual(
        gen.next().value,
        put({
          type: VIEW_REDIRECT_REQUEST,
          meta: { source: {} }
        })
      );
    });

    it('should throw if softRedirectSaga throws', () => {
      assert.throws(gen.next, err => typeof err === 'object')
    });
  });
});
