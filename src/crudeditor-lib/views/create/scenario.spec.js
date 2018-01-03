import { expect } from 'chai';
import { put } from 'redux-saga/effects';
import scenario from './scenario';
import { VIEW_INITIALIZE } from './constants';

const arg = {
  modelDefinition: {},
  softRedirectSaga: _ => null,
  viewState: {}
}

describe('create view / scenario', () => {
  const gen = scenario(arg);

  it('should put VIEW_INITIALIZE', () => {
    const { value, done } = gen.next();
    expect(value).to.deep.equal(put({
      type: VIEW_INITIALIZE,
      payload: { predefinedFields: arg.viewState.predefinedFields || {} },
      meta: { source: arg.source }
    }));
    expect(done).to.be.false; // eslint-disable-line no-unused-expressions
  })

  it('should fork scenario saga', () => {
    const { value, done } = gen.next();
    expect(value).to.have.ownProperty('FORK');
    expect(done).to.be.false; // eslint-disable-line no-unused-expressions
  })

  it('should end iterator', () => {
    const { done } = gen.next();
    expect(done).to.be.true; // eslint-disable-line no-unused-expressions
  })
})
