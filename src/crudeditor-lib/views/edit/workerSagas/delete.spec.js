import { expect } from 'chai';
import { runSaga } from 'redux-saga';
import { call } from 'redux-saga/effects';
import sinon from 'sinon';
import deleteSaga from './delete';
import { INSTANCES_DELETE_REQUEST, INSTANCES_DELETE_SUCCESS, INSTANCES_DELETE_FAIL } from '../../../common/constants';
import { VIEW_REDIRECT_REQUEST } from '../constants';

import {
  VIEW_ERROR,
  VIEW_SEARCH
} from '../../../common/constants';

describe('edit view / workerSagas / delete', () => {
  const instances = [{
    a: 'b'
  }]

  const deleteApi = sinon.spy();
  const softRedirectSaga = sinon.spy();

  const arg = {
    modelDefinition: {
      api: {
        delete: deleteApi
      },
      model: {
        fields: {
          a: {}
        }
      }
    },
    softRedirectSaga,
    action: {
      payload: { instances },
      meta: {}
    }
  }

  it('should redirect to search view after successful delete', () => {
    const dispatched = [];

    runSaga({
      dispatch: (action) => dispatched.push(action)
    }, deleteSaga, arg);

    expect(dispatched.map(({ type }) => type)).deep.equal([
      INSTANCES_DELETE_REQUEST,
      INSTANCES_DELETE_SUCCESS,
      VIEW_REDIRECT_REQUEST
    ])

    expect(dispatched.find(({ type }) => type === INSTANCES_DELETE_SUCCESS).payload).deep.equal({ instances })

    expect(deleteApi.calledOnce).to.be.true; // eslint-disable-line no-unused-expressions
    expect(softRedirectSaga.calledOnce).to.be.true; // eslint-disable-line no-unused-expressions
    expect(softRedirectSaga.calledWith({ // eslint-disable-line no-unused-expressions
      viewName: VIEW_SEARCH
    })).to.be.true;
  })

  it('should redirect to error view if redirect to search view failed', () => {
    const dispatched = [];

    const err = {
      code: 400,
      message: 'Failed to redirect to search view'
    }

    const wrapper = function*(...args) {
      try {
        yield call(deleteSaga, ...args)
      } catch (e) {
        expect(e).to.deep.equal(err)
      }
    }

    const softRedirectSaga = sinon.stub().throws(err);

    runSaga({
      dispatch: (action) => dispatched.push(action)
    }, wrapper, {
      ...arg,
      softRedirectSaga
    });

    expect(softRedirectSaga.calledTwice).to.be.true; // eslint-disable-line no-unused-expressions
    expect(softRedirectSaga.firstCall.calledWith({ // eslint-disable-line no-unused-expressions
      viewName: VIEW_SEARCH
    })).to.be.true;
    expect(softRedirectSaga.secondCall.calledWith({ // eslint-disable-line no-unused-expressions
      viewName: VIEW_ERROR,
      viewState: err
    })).to.be.true;
  })

  it('should throw if delete api fails', () => {
    const dispatched = [];

    const err = {
      code: 500,
      message: 'Delete api failed'
    }

    const wrapper = function*(...args) {
      try {
        yield call(deleteSaga, ...args)
      } catch (e) {
        expect(e).to.deep.equal(err)
      }
    }

    const badApi = sinon.stub().throws(err);

    runSaga({
      dispatch: (action) => dispatched.push(action)
    }, wrapper, {
      ...arg,
      modelDefinition: {
        ...arg.modelDefinition,
        api: {
          delete: badApi
        }
      }
    });

    expect(badApi.calledOnce).to.be.true; // eslint-disable-line no-unused-expressions

    expect(dispatched.map(({ type }) => type)).deep.equal([
      INSTANCES_DELETE_REQUEST,
      INSTANCES_DELETE_FAIL
    ])

    expect(dispatched.find(({ type }) => type === INSTANCES_DELETE_FAIL).payload).deep.equal(err)
  })
})
