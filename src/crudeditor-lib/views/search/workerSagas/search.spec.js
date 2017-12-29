import { expect } from 'chai';
import { runSaga } from 'redux-saga';
import searchSaga from './search';

import {
  INSTANCES_SEARCH_FAIL,
  INSTANCES_SEARCH_REQUEST,
  INSTANCES_SEARCH_SUCCESS,

  VIEW_NAME
} from '../constants';

describe('search view / worker sagas / search', () => {
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

  const instances = [{ a: 1 }, { b: 2 }];

  const searchApi = _ => ({ instances, totalCount: instances.length });

  const arg = {
    modelDefinition: {
      api: {
        search: searchApi
      }
    },
    action: {
      payload: {},
      meta: {}
    }
  }

  describe('good case', () => {
    it('should put INSTANCES_SEARCH_REQUEST and INSTANCES_SEARCH_SUCCESS', () => {
      const dispatched = [];

      runSaga({
        dispatch: (action) => dispatched.push(action),
        getState
      }, searchSaga, arg);

      expect(dispatched[0].type).to.equal(INSTANCES_SEARCH_REQUEST);
      expect(dispatched[1].type).to.equal(INSTANCES_SEARCH_SUCCESS);
      expect(dispatched[1].payload.instances).to.deep.equal(instances);
    })
  })

  describe('bad case', () => {
    it('should put INSTANCES_SEARCH_REQUEST and INSTANCES_SEARCH_FAIL', () => {
      const dispatched = [];

      const err = {
        code: 232
      }

      const badSearch = _ => {
        throw err
      }

      runSaga({
        dispatch: (action) => dispatched.push(action),
        getState
      }, searchSaga, {
        ...arg,
        modelDefinition: {
          api: {
            search: badSearch
          }
        }
      });

      expect(dispatched[0].type).to.equal(INSTANCES_SEARCH_REQUEST);
      expect(dispatched[1].type).to.equal(INSTANCES_SEARCH_FAIL);
      expect(dispatched[1].payload).to.deep.equal(err);
    })
  })
})
