import { expect } from 'chai';
import { put, spawn } from 'redux-saga/effects';
import scenario from './scenario';
import commonScenario from '../../common/scenario';
import saveSaga from './workerSagas/save';
import redirectSaga from '../../common/workerSagas/redirect';
import { VIEW_SOFT_REDIRECT } from '../../common/constants';

import {
  INSTANCE_SAVE,
  VIEW_INITIALIZE,
  VIEW_NAME
} from './constants';

const transitions = {
  blocking: {
    [INSTANCE_SAVE]: saveSaga
  },
  nonBlocking: {
    [VIEW_SOFT_REDIRECT]: redirectSaga
  }
}

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
    expect(value).to.deep.equal(spawn(commonScenario, {
      viewName: VIEW_NAME,
      modelDefinition: arg.modelDefinition,
      softRedirectSaga: arg.softRedirectSaga,
      transitions
    }))
    expect(done).to.be.false; // eslint-disable-line no-unused-expressions
  })

  it('should end iterator', () => {
    const { done } = gen.next();
    expect(done).to.be.true; // eslint-disable-line no-unused-expressions
  })
})
