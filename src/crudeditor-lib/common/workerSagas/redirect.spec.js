import { expect } from 'chai';
import { runSaga } from 'redux-saga';
import sinon from 'sinon';
import redirectSaga from './redirect';
import { VIEW_SEARCH, VIEW_EDIT } from '../constants';
import {
  VIEW_REDIRECT_REQUEST as SEARCH_VIEW_REDIRECT_REQUEST,
  VIEW_REDIRECT_FAIL as SEARCH_VIEW_REDIRECT_FAIL
} from '../../views/search/constants';

describe('common / workerSagas / redirect saga', () => {
  const softRedirectSaga = _ => null;

  const arg = {
    modelDefinition: {},
    softRedirectSaga,
    action: {
      payload: {
        view: {
          name: VIEW_EDIT,
          state: { a: 'b' }
        }
      },
      meta: {
        spawner: VIEW_SEARCH
      }
    }
  }

  describe('good case', () => {
    const gen = redirectSaga(arg);

    it('should put VIEW_REDIRECT_REQUEST', () => {
      const { value, done } = gen.next();
      expect(value).to.have.ownProperty('PUT');
      expect(value.PUT.action.type).to.equal(SEARCH_VIEW_REDIRECT_REQUEST);
      expect(value.PUT.action.meta).to.deep.equal(arg.action.meta)
      expect(done).to.be.false; // eslint-disable-line no-unused-expressions
    });

    it('should call softRedirectSaga', () => {
      const { value, done } = gen.next();
      expect(value).to.have.ownProperty('CALL');
      expect(value.CALL).to.have.ownProperty('fn');
      expect(value.CALL.fn).to.equal(softRedirectSaga);
      expect(value.CALL.args).to.deep.equal([{
        viewName: arg.action.payload.view.name,
        viewState: arg.action.payload.view.state
      }]);
      expect(done).to.be.false; // eslint-disable-line no-unused-expressions
    });

    it('should end iterator', () => {
      const { done } = gen.next();
      expect(done).to.be.true; // eslint-disable-line no-unused-expressions
    });
  });

  describe('bad case', () => {
    const dispatched = [];

    const err = {
      code: 345
    }

    const badRedirect = sinon.stub().throws(err)

    it('should put VIEW_REDIRECT_FAIL', () => {
      runSaga({
        dispatch: (action) => dispatched.push(action)
      }, redirectSaga, {
        ...arg,
        softRedirectSaga: badRedirect
      });

      expect([SEARCH_VIEW_REDIRECT_REQUEST, SEARCH_VIEW_REDIRECT_FAIL]. // eslint-disable-line no-unused-expressions
        reduce((acc, cur) => acc && !!dispatched.find(el => el.type === cur), true)).
        to.be.true;

      expect(dispatched.find(({ type }) => type === SEARCH_VIEW_REDIRECT_FAIL).payload).to.be.deep.equal(err);
    });
  })
});
