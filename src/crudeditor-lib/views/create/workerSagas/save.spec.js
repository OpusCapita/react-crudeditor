// import { expect } from 'chai';
import saveSaga from './save';

describe('create / workerSagas / save', () => {
  const arg = {
    modelDefinition: {
      model: {
        validate: _ => true
      },
      api: {
        create: ({ instance }) => instance
      }
    },
    softRedirectSaga: _ => null,
    action: {
      payload: {},
      meta: {}
    }
  }

  const instance = {
    a: 'b'
  }

  const go = saveSaga(arg);

  it('should', () => {
    go.next();
    go.next(instance);
    const { value, done } = go.next();
    console.log('>>>>>>>', value, done)
  })
})
