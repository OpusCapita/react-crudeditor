import assert from 'assert';

import index from './index';

describe('fieldTypes :: boolean', () => {
  describe('isValid', () => {
    it('should return true for null', () => {
      assert.equal(index.isValid(null), true)
    });

    it('should return true for boolean true', () => {
      assert.equal(index.isValid(true), true)
    });

    it('should return true for boolean false', () => {
      assert.equal(index.isValid(false), true)
    });

    it('should return false for undefined, number or string', () => {
      assert.equal(index.isValid(undefined), false)
      assert.equal(index.isValid(0), false)
      assert.equal(index.isValid(12), false)
      assert.equal(index.isValid(''), false)
      assert.equal(index.isValid('qweqwewq'), false)
    });
  });
});
