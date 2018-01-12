import { expect } from 'chai';
import { call, put } from 'redux-saga/effects';
import sinon from 'sinon';
import editSaga from './edit';
import searchSaga from '../../search/workerSagas/search';
import editAdjacent from './editAdjacent';

import { ADJACENT_INSTANCE_EDIT_FAIL } from '../constants';

describe('edit view / workerSagas / editAdjacent', () => {
  const get = sinon.spy();
  const softRedirectSaga = sinon.spy();

  const arg = {
    modelDefinition: {
      api: {
        get
      },
      model: {
        fields: {
          a: {}
        }
      }
    },
    softRedirectSaga,
    action: {
      payload: { step: 1 },
      meta: {}
    }
  }

  it('should call edit saga if instance is found', () => {
    const go = editAdjacent(arg);
    const instance = { a: 'b' };
    const previousOffset = 4;
    const nextOffset = previousOffset + arg.action.payload.step

    expect(go.next().value).to.have.ownProperty('SELECT');

    expect(go.next(previousOffset).value).to.deep.equal(call(searchSaga, {
      modelDefinition: arg.modelDefinition,
      action: {
        payload: {
          offset: nextOffset,
          max: 1
        },
        meta: arg.action.meta
      }
    }))

    expect(go.next([instance]).value).to.deep.equal(call(editSaga, {
      modelDefinition: arg.modelDefinition,
      action: {
        payload: {
          instance,
          offset: nextOffset
        },
        meta: arg.action.meta
      }
    }))

    expect(go.next().done).to.be.true; // eslint-disable-line no-unused-expressions
  })

  it('should put ADJACENT_INSTANCE_EDIT_FAIL if no instance is found', () => {
    const go = editAdjacent(arg);
    const previousOffset = 4;
    const nextOffset = previousOffset + arg.action.payload.step

    expect(go.next().value).to.have.ownProperty('SELECT');

    expect(go.next(previousOffset).value).to.deep.equal(call(searchSaga, {
      modelDefinition: arg.modelDefinition,
      action: {
        payload: {
          offset: nextOffset,
          max: 1
        },
        meta: arg.action.meta
      }
    }))

    expect(go.next([]).value).to.deep.equal(put({
      type: ADJACENT_INSTANCE_EDIT_FAIL,
      meta: arg.action.meta
    }))

    expect(go.next().done).to.be.true; // eslint-disable-line no-unused-expressions
  })
})
