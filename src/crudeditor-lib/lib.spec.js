import { expect } from 'chai';
import sinon from 'sinon';
import { isAllowed } from './lib';

describe('crudeditor-lib / lib.js', () => {
  describe('isAllowed', () => {
    const f = sinon.spy();

    const permissions = {
      create: true,
      edit: ({ instance } = {}) => {
        if (instance) {
          f(instance);
          return instance.editable
        }
        return true
      },
      delete: false
    }

    it('returns boolean if boolean is defined', () => {
      expect(isAllowed(permissions, 'create')).to.equal(true);
      expect(isAllowed(permissions, 'delete')).to.equal(false);
    });

    it('executes a function for global permissions', () => {
      expect(isAllowed(permissions, 'edit')).to.equal(true);
      expect(f.called).to.equal(false);
    });

    it('executes a function for instance permissions', () => {
      const instance = {
        editable: false
      }
      expect(isAllowed(permissions, 'edit', { instance })).to.equal(instance.editable);
      expect(f.calledOnce).to.be.true; // eslint-disable-line no-unused-expressions
      expect(f.calledWith(instance)).to.be.true; // eslint-disable-line no-unused-expressions
    });
  })
})
