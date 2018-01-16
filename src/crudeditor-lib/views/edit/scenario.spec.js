import { expect } from 'chai';
import { runSaga } from 'redux-saga';
import { call } from 'redux-saga/effects';
import scenarioSaga from './scenario';

import {
  TAB_SELECT,

  VIEW_INITIALIZE_REQUEST,
  VIEW_INITIALIZE_FAIL,
  VIEW_INITIALIZE_SUCCESS,
  INSTANCE_EDIT_REQUEST,
  INSTANCE_EDIT_SUCCESS,
  INSTANCE_EDIT_FAIL
} from './constants';

const arg = {
  modelDefinition: {
    api: {
      get: _ => ({})
    },
    model: {
      fields: {}
    }
  },
  softRedirectSaga: _ => null,
  viewState: {}
}

describe('edit view / scenario', () => {
  it('should dispatch required actions in order', () => {
    const dispatched = [];

    runSaga({
      dispatch: (action) => dispatched.push(action)
    }, scenarioSaga, arg);

    expect(dispatched.map(({ type }) => type)).to.deep.equal([
      VIEW_INITIALIZE_REQUEST,
      INSTANCE_EDIT_REQUEST,
      INSTANCE_EDIT_SUCCESS,
      TAB_SELECT,
      VIEW_INITIALIZE_SUCCESS
    ])
  });

  it('should fail if get api throws an error', () => {
    const dispatched = [];

    const errMessage = 'Pretend that server-side failed';

    const wrapper = function*(...args) {
      try {
        yield call(scenarioSaga, ...args)
      } catch (e) {
        expect(e.message).deep.equal(errMessage)
      }
    }

    runSaga({
      dispatch: (action) => dispatched.push(action)
    }, wrapper, {
      ...arg,
      modelDefinition: {
        ...arg.modelDefinition,
        api: {
          get: _ => { throw new Error(errMessage) }
        }
      }
    });

    expect(dispatched.map(({ type }) => type)).to.deep.equal([
      VIEW_INITIALIZE_REQUEST,
      INSTANCE_EDIT_REQUEST,
      INSTANCE_EDIT_FAIL,
      VIEW_INITIALIZE_FAIL
    ])
  });
})
