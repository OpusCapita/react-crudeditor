import { expect } from 'chai';
import { runSaga } from 'redux-saga';
import scenarioSaga from './scenario';

import {
  VIEW_INITIALIZE
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
  viewState: {
    code: 303,
    message: 'Some error'
  }
}

describe('error view / scenario', () => {
  it('should initialize view with error', () => {
    const dispatched = [];

    runSaga({
      dispatch: (action) => dispatched.push(action)
    }, scenarioSaga, arg);

    expect(dispatched[0]).to.deep.equal({
      type: VIEW_INITIALIZE,
      payload: arg.viewState,
      meta: {
        source: arg.source
      }
    })
  });
})
