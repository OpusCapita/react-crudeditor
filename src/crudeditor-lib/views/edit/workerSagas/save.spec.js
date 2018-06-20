import { expect } from 'chai';
import { runSaga } from 'redux-saga';
import sinon from 'sinon';
import saveSaga from './save';
import {
  VIEW_NAME,
  ALL_INSTANCE_FIELDS_VALIDATE_REQUEST,
  INSTANCE_VALIDATE_REQUEST,
  INSTANCE_VALIDATE_SUCCESS,
  INSTANCE_SAVE_REQUEST,
  INSTANCE_SAVE_SUCCESS,
  AFTER_ACTION_NEW
} from '../constants';
import { VIEW_SEARCH, VIEW_CREATE } from '../../../common/constants';

const updateApi = sinon.spy();
const softRedirectSaga = sinon.spy();
const validate = sinon.spy();
const defaultNewInstance = sinon.spy();

const arg = {
  modelDefinition: {
    api: {
      update: updateApi
    },
    model: {
      validate
    },
    ui: {
      create: {
        defaultNewInstance
      },
      search: {
        resultFields: [{ name: 'a' }]
      }
    }
  },
  softRedirectSaga,
  action: {
    payload: {},
    meta: {}
  }
}

const instance = { a: 'b' };

const getState = _ => ({
  views: {
    [VIEW_NAME]: {
      formInstance: instance,
      errors: {
        fields: {}
      }
    },
    [VIEW_SEARCH]: {
      pageParams: {},
      sortParams: {},
      resultFilter: {}
    }
  }
})

describe('edit view / workerSagas / save', () => {
  it('should put all required actions in order', () => {
    const dispatched = [];

    runSaga({
      dispatch: (action) => dispatched.push(action),
      getState
    }, saveSaga, arg);

    expect(dispatched.map(({ type }) => type)).deep.equal([
      ALL_INSTANCE_FIELDS_VALIDATE_REQUEST,
      INSTANCE_VALIDATE_REQUEST,
      INSTANCE_VALIDATE_SUCCESS,
      INSTANCE_SAVE_REQUEST,
      INSTANCE_SAVE_SUCCESS
    ])

    expect(validate.calledOnce).to.be.true; // eslint-disable-line no-unused-expressions
    expect(updateApi.calledOnce).to.be.true; // eslint-disable-line no-unused-expressions
    expect(softRedirectSaga.called).to.be.false; // eslint-disable-line no-unused-expressions
  })

  it(`should redirect to 'create' if called with AFTER_ACTION_NEW`, () => {
    const dispatched = [];

    runSaga({
      dispatch: (action) => dispatched.push(action),
      getState
    }, saveSaga, {
      ...arg,
      action: {
        ...arg.action,
        payload: {
          afterAction: AFTER_ACTION_NEW
        }
      }
    });

    expect(softRedirectSaga.firstCall.calledWith({ // eslint-disable-line no-unused-expressions
      viewName: VIEW_CREATE,
      viewState: {
        predefinedFields: {}
      }
    })).to.be.true;
  })
})
