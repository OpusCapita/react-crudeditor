import assert from 'assert';
import { throwError } from './lib';

describe('fieldTypes lib', () => {
  describe('throwError', () => {
    it('should throw given object', () => {
      const err = { a: 'b' };
      try {
        throwError(err);
        assert(false)
      } catch (e) {
        assert.deepEqual(e, err)
      }
    })
  })
});
