import { expect } from 'chai';
import { runSaga } from 'redux-saga';
import { call } from 'redux-saga/effects';
import scenarioSaga from './scenario';
import {
  VIEW_NAME,
  VIEW_INITIALIZE_REQUEST,
  VIEW_INITIALIZE_SUCCESS,
  VIEW_INITIALIZE_FAIL,
  INSTANCES_SEARCH_REQUEST,
  INSTANCES_SEARCH_SUCCESS,
  INSTANCES_SEARCH_FAIL
} from './constants';

const instances = [{ a: 1 }, { b: 2 }];

const searchApi = _ => ({ instances, totalCount: instances.length });

const arg = {
  modelDefinition: {
    api: {
      search: searchApi
    },
    model: {
      fields: {}
    }
  },
  softRedirectSaga: _ => null,
  viewState: {}
}

const getState = _ => ({
  views: {
    [VIEW_NAME]: {
      resultFilter: {},
      sortParams: {
        field: '',
        order: 'asc'
      },
      pageParams: {
        max: 30,
        offset: 0
      },
      errors: {
        fields: {}
      }
    }
  }
})

describe('search view / scenario', () => {
  it('should dispatch required actions in order', () => {
    const dispatched = [];

    runSaga({
      dispatch: (action) => dispatched.push(action),
      getState
    }, scenarioSaga, arg);

    expect(dispatched.map(({ type }) => type)).to.deep.equal([
      VIEW_INITIALIZE_REQUEST,
      INSTANCES_SEARCH_REQUEST,
      INSTANCES_SEARCH_SUCCESS,
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
        expect(e.message).equal(errMessage)
      }
    }

    runSaga({
      dispatch: (action) => dispatched.push(action),
      getState
    }, wrapper, {
      ...arg,
      modelDefinition: {
        ...arg.modelDefinition,
        api: {
          search: _ => { throw new Error(errMessage) }
        }
      }
    });

    expect(dispatched.map(({ type }) => type)).to.deep.equal([
      VIEW_INITIALIZE_REQUEST,
      INSTANCES_SEARCH_REQUEST,
      INSTANCES_SEARCH_FAIL,
      VIEW_INITIALIZE_FAIL
    ])
  });
})
