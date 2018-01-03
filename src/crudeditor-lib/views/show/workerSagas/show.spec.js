import { call, put } from 'redux-saga/effects';
import { runSaga } from 'redux-saga';
import sinon from 'sinon';
import 'regenerator-runtime/runtime'
import { assert, expect } from 'chai';

import showSaga from './show';
import { getLogicalKeyBuilder } from '../../lib';

import {
  INSTANCE_SHOW_REQUEST,
  INSTANCE_SHOW_SUCCESS,
  INSTANCE_SHOW_FAIL
} from '../constants';

describe('show view: show saga', () => {
  const arg = {
    modelDefinition: {
      api: { get: _ => null },
      model: {
        fields: {
          id: {
            unique: true
          }
        }
      }
    },
    softRedirectSaga: _ => null,
    action: {
      payload: {
        instance: {
          id: "someId"
        }
      },
      meta: { source: {} }
    }
  }

  describe('good case', () => {
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
        call(arg.modelDefinition.api.get, {
          instance: getLogicalKeyBuilder(arg.modelDefinition.model.fields)(arg.action.payload.instance)
        })
      );
    });

    it('should dispatch INSTANCE_SHOW_SUCCESS', () => {
      assert.deepEqual(
        gen.next().value,
        put({
          type: INSTANCE_SHOW_SUCCESS,
          payload: { instance: undefined, offset: undefined },
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
  })


  describe('bad case', () => {
    const dispatched = [];

    const err = {
      code: 345
    }

    const badApi = sinon.stub().throws(err)

    it('should put VIEW_REDIRECT_FAIL', () => {
      runSaga({
        dispatch: (action) => dispatched.push(action)
      }, showSaga, {
        ...arg,
        modelDefinition: {
          ...arg.modelDefinition,
          api: {
            get: badApi
          }
        }
      });

      expect(dispatched.find(({ type }) => type === INSTANCE_SHOW_FAIL).payload).to.deep.equal(err);
    });
  })
});
