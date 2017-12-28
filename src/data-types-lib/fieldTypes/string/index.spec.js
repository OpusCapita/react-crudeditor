import assert from 'assert';

import index from './index';

import {
  CONSTRAINT_MIN,
  CONSTRAINT_MAX,
  ERROR_CODE_VALIDATION,
  ERROR_MIN_DECEEDED,
  ERROR_MAX_EXCEEDED,
} from '../../constants';

const validateConstraints = (validator, constraints) => Object.keys(validator).
  filter(key => Object.keys(constraints).indexOf(key) > -1).
  reduce((res, cur) => res && validator[cur](constraints[cur]), true);

describe('fieldTypes :: string', () => {
  describe('isValid', () => {
    it('should return true for null', () => {
      assert.equal(index.isValid(null), true)
    });

    it('should return true for string', () => {
      assert.equal(index.isValid('21321'), true)
    });

    it('should return true for empty string', () => {
      assert.equal(index.isValid(''), true)
    });

    it('should return false for undefined, number or boolean', () => {
      assert.equal(index.isValid(undefined), false)
      assert.equal(index.isValid(234), false)
      assert.equal(index.isValid(false), false)
    });
  });

  describe('buildValidator', () => {
    const constraints = {
      [CONSTRAINT_MIN]: 3,
      [CONSTRAINT_MAX]: 6
    }
    const word = 'Hello'
    it('should properly validate a value', () => {
      const value = word; // 5
      const validator = index.buildValidator(value);

      const result = validateConstraints(validator, constraints);

      assert.equal(result, true)
    });

    it('should throw for lower value', () => {
      const value = word.slice(0, constraints[CONSTRAINT_MIN] - 1);
      const validator = index.buildValidator(value);

      try {
        validateConstraints(validator, constraints);
        assert(false);
      } catch (e) {
        assert.deepEqual(
          e, {
            code: ERROR_CODE_VALIDATION,
            id: ERROR_MIN_DECEEDED,
            message: constraints[CONSTRAINT_MIN]
          }
        )
      }
    });

    it('should throw for higher value', () => {
      const value = word + [...Array(constraints[CONSTRAINT_MAX] + 1 - word.length)].map(el => 'a').join('');
      const validator = index.buildValidator(value);

      try {
        validateConstraints(validator, constraints);
        assert(false);
      } catch (e) {
        assert.deepEqual(
          e, {
            code: ERROR_CODE_VALIDATION,
            id: ERROR_MAX_EXCEEDED,
            message: constraints[CONSTRAINT_MAX]
          }
        )
      }
    });
  });
});
