import { expect } from 'chai';
import { runSaga } from 'redux-saga';
import { call } from 'redux-saga/effects';
import redirectSaga from '../../../common/workerSagas/redirect';
import saveSaga from './save';
import { VIEW_EDIT, VIEW_SEARCH } from '../../../common/constants';
import {
  AFTER_ACTION_NEW,
  VIEW_NAME,

  ALL_INSTANCE_FIELDS_VALIDATE_REQUEST,
  INSTANCE_VALIDATE_REQUEST,
  INSTANCE_VALIDATE_SUCCESS,
  INSTANCE_SAVE_REQUEST,
  INSTANCE_SAVE_SUCCESS,
  VIEW_INITIALIZE,
  INSTANCE_VALIDATE_FAIL,
  INSTANCE_SAVE_FAIL
} from '../constants';

describe('create / workerSagas / save', () => {
  const arg = {
    modelDefinition: {
      model: {
        validate: _ => true,
        fields: {}
      },
      api: {
        create: ({ instance }) => instance
      },
      permissions: {
        crudOperations: {
          edit: true
        }
      },
      ui: {
        create: {
          defaultNewInstance: _ => {}
        },
        search: {
          resultFields: [{ name: 'a' }]
        }
      }
    },
    softRedirectSaga: _ => null,
    action: {
      payload: {},
      meta: {
        spawner: VIEW_NAME
      }
    }
  }

  const getState = _ => ({
    views: {
      [VIEW_NAME]: {
        formInstance: {},
        errors: {
          fields: {}
        }
      },
      [VIEW_SEARCH]: {
        resultFilter: {},
        sortParams: {
          field: 'a'
        },
        pageParams: {}
      }
    }
  });

  const instance = {
    a: 'b'
  }

  const tab = [];
  tab.tab = 'general';

  it('should redirect to Edit view after save', () => {
    const go = saveSaga(arg);
    go.next();
    go.next();
    go.next(instance);
    const { value, done } = go.next(tab);
    expect(value).to.deep.equal(call(redirectSaga, {
      modelDefinition: arg.modelDefinition,
      softRedirectSaga: arg.softRedirectSaga,
      action: {
        payload: {
          view: {
            name: VIEW_EDIT,
            state: {
              instance,
              tab: tab.tab
            }
          }
        },
        meta: arg.action.meta
      }
    }));
    expect(done).to.be.false; // eslint-disable-line no-unused-expressions
    expect(go.next().done).to.be.true; // eslint-disable-line no-unused-expressions
  });

  it('should initialize again for saveAndNew action', () => {
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

    expect(dispatched.map(({ type }) => type)).deep.equal([
      ALL_INSTANCE_FIELDS_VALIDATE_REQUEST,
      INSTANCE_VALIDATE_REQUEST,
      INSTANCE_VALIDATE_SUCCESS,
      INSTANCE_SAVE_REQUEST,
      INSTANCE_SAVE_SUCCESS,
      VIEW_INITIALIZE
    ])
  });

  it('should throw if instance validation fails', () => {
    const dispatched = [];

    const err = {
      code: 213,
      id: 'booobabooo',
      message: 'Custom validation failed.'
    }

    const wrapper = function*(...args) {
      try {
        yield call(saveSaga, ...args)
      } catch (e) {
        expect(e).deep.equal(err)
      }
    }

    runSaga({
      dispatch: (action) => dispatched.push(action),
      getState
    }, wrapper, {
      ...arg,
      modelDefinition: {
        ...arg.modelDefinition,
        model: {
          ...arg.modelDefinition.model,
          validate: _ => { throw err }
        }
      }
    });

    expect(dispatched.map(({ type }) => type)).deep.equal([
      ALL_INSTANCE_FIELDS_VALIDATE_REQUEST,
      INSTANCE_VALIDATE_REQUEST,
      INSTANCE_VALIDATE_FAIL
    ])
  });

  it('should throw if there are fieldErrors', () => {
    const dispatched = [];

    const fieldErrors = {
      a: [{ code: 42 }]
    }

    const wrapper = function*(...args) {
      try {
        yield call(saveSaga, ...args)
      } catch (e) {
        expect(e).deep.equal(fieldErrors)
      }
    }

    runSaga({
      dispatch: (action) => dispatched.push(action),
      getState: _ => ({
        views: {
          [VIEW_NAME]: {
            formInstance: {},
            errors: {
              fields: fieldErrors
            }
          },
          [VIEW_SEARCH]: {
            resultFilter: {},
            sortParams: {
              field: 'a'
            },
            pageParams: {}
          }
        }
      })
    }, wrapper, arg);
  });

  it('should throw if create api throws', () => {
    const dispatched = [];

    const err = {
      code: 500,
      id: 'internalServerError',
      message: `I don't wanna save this instance!`
    }

    const wrapper = function*(...args) {
      try {
        yield call(saveSaga, ...args)
      } catch (e) {
        expect(e).deep.equal(err)
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
          create: _ => { throw err }
        }
      }
    });

    expect(dispatched.map(({ type }) => type)).deep.equal([
      ALL_INSTANCE_FIELDS_VALIDATE_REQUEST,
      INSTANCE_VALIDATE_REQUEST,
      INSTANCE_VALIDATE_SUCCESS,
      INSTANCE_SAVE_REQUEST,
      INSTANCE_SAVE_FAIL
    ]);

    expect(dispatched.find(({ type }) => type === INSTANCE_SAVE_FAIL).payload).deep.equal(err);
  });
})
