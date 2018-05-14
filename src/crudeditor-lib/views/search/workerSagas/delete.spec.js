import { expect } from 'chai';
import omit from 'lodash/omit';

import deleteSaga from './delete';
import searchSaga from './search';
import commonDeleteSaga from '../../../common/workerSagas/delete';

describe('search view / worker sagas / delete', () => {
  const instances = [{ a: 1 }, { b: 2 }];

  const arg = {
    modelDefinition: {},
    softRedirectSaga: _ => null,
    action: {
      payload: { instances },
      meta: {}
    }
  }

  const gen = deleteSaga(arg);

  it('should call delete saga', () => {
    const { value, done } = gen.next();
    expect(value).to.have.ownProperty('CALL');
    expect(value.CALL.fn).to.equal(commonDeleteSaga);
    expect(value.CALL.args[0]).to.deep.equal(omit(arg, ['softRedirectSaga']));
    expect(done).to.be.false; // eslint-disable-line no-unused-expressions
  })

  it('should call search saga', () => {
    const { value, done } = gen.next();
    expect(value).to.have.ownProperty('CALL');
    expect(value.CALL.fn).to.equal(searchSaga);
    expect(done).to.be.false; // eslint-disable-line no-unused-expressions
  })

  it('should end iterator', () => {
    const { done } = gen.next();
    expect(done).to.be.true; // eslint-disable-line no-unused-expressions
  })
})
