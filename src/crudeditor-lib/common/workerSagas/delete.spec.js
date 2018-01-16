import { expect } from 'chai';
import { runSaga } from 'redux-saga';
import { call } from 'redux-saga/effects';
import sinon from 'sinon';
import deleteSaga from './delete';
import {
  INSTANCES_DELETE_FAIL,
  INSTANCES_DELETE_REQUEST,
  INSTANCES_DELETE_SUCCESS,
} from '../constants';

describe('common / workerSagas / delete saga', () => {
  const instances = [{ a: 1 }, { b: 2 }];

  const arg = {
    modelDefinition: {
      api: {
        delete: _ => null
      },
      model: {
        fields: {
          id: {
            unique: true
          }
        }
      }
    },
    action: {
      payload: {
        instances
      }
    }
  }

  describe('good case', () => {
    const dispatched = [];

    it('should put INSTANCES_DELETE_REQUEST and INSTANCES_DELETE_SUCCESS', () => {
      runSaga({ dispatch: (action) => dispatched.push(action) }, deleteSaga, arg);

      expect(dispatched[0].type).to.equal(INSTANCES_DELETE_REQUEST);
      expect(dispatched[1].type).to.equal(INSTANCES_DELETE_SUCCESS);
      expect(dispatched[1].payload).to.be.deep.equal(arg.action.payload);
    });
  });

  describe('bad case', () => {
    const dispatched = [];

    const err = {
      code: 345
    }

    const badFunc = sinon.stub().throws(err)

    const wrapper = function*(...args) {
      try {
        yield call(deleteSaga, ...args)
      } catch (e) {
        expect(e).deep.equal(err)
      }
    }

    it('should put INSTANCES_DELETE_FAIL', () => {
      runSaga({
        dispatch: (action) => dispatched.push(action)
      }, wrapper, {
        ...arg,
        modelDefinition: {
          ...arg.modelDefinition,
          api: {
            delete: badFunc
          }
        }
      });

      expect(dispatched[0].type).to.equal(INSTANCES_DELETE_REQUEST);
      expect(dispatched[1].type).to.equal(INSTANCES_DELETE_FAIL);
      expect(dispatched[1].payload).to.be.deep.equal(err);
    });
  })
});
