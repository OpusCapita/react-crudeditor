import { expect } from 'chai';
import { cloneableGenerator } from 'redux-saga/utils';
import showAdjacentSaga from './showAdjacent';
import showSaga from './show';
import searchSaga from '../../search/workerSagas/search';
import { ADJACENT_INSTANCE_SHOW_FAIL } from '../constants';

describe('show view: showAdjacent saga', () => {
  const arg = {
    modelDefinition: {},
    action: {
      payload: {
        step: 1
      },
      meta: {}
    }
  }

  const gen = cloneableGenerator(showAdjacentSaga)(arg);

  it('should select from store', () => {
    const { value, done } = gen.next();
    expect(value).to.have.ownProperty('SELECT');
    expect(done).to.be.false; // eslint-disable-line no-unused-expressions
  });

  it('should call search', () => {
    const { value, done } = gen.next();
    expect(value).to.have.ownProperty('CALL');
    expect(value.CALL).to.have.ownProperty('fn');
    expect(value.CALL.fn).to.equal(searchSaga);
    expect(done).to.be.false; // eslint-disable-line no-unused-expressions
  });

  it('should call showSaga if instance is found', () => {
    const clone = gen.clone();
    const instance = { id: '10' };
    const { value, done } = clone.next([instance]);
    expect(value).to.have.ownProperty('CALL');
    expect(value.CALL).to.have.ownProperty('fn');
    expect(value.CALL.fn).to.equal(showSaga);
    expect(value.CALL.args[0].action.payload.instance).to.deep.equal(instance);
    expect(done).to.be.false; // eslint-disable-line no-unused-expressions

    expect(clone.next().done).to.be.true; // eslint-disable-line no-unused-expressions
  });

  it('should put ADJACENT_INSTANCE_SHOW_FAIL if nothing found', () => {
    const clone = gen.clone();
    const { value, done } = clone.next([]);
    expect(value).to.have.ownProperty('PUT');
    expect(value.PUT.action.type).to.equal(ADJACENT_INSTANCE_SHOW_FAIL);
    expect(done).to.be.false; // eslint-disable-line no-unused-expressions

    expect(clone.next().done).to.be.true; // eslint-disable-line no-unused-expressions
  });
});
