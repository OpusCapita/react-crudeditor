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

describe('fieldTypes :: decimal', () => {
  describe('isValid', () => {
    it('should return true for null', () => {
      assert.equal(index.isValid(null), true)
    });

    it('should return true for integer', () => {
      assert.equal(index.isValid(21321), true)
    });

    it('should return true for decimal', () => {
      assert.equal(index.isValid(123.5698), true)
    });

    it('should return false for NaN', () => {
      assert.equal(index.isValid(NaN), false)
    });

    it('should return false for undefined, string or boolean', () => {
      assert.equal(index.isValid(undefined), false)
      assert.equal(index.isValid(true), false)
      assert.equal(index.isValid(false), false)
      assert.equal(index.isValid(''), false)
      assert.equal(index.isValid('qweqwewq'), false)
    });
  });

  describe('buildValidator', () => {
    const constraints = {
      [CONSTRAINT_MIN]: 5.7,
      [CONSTRAINT_MAX]: 16.5
    }

    it('should properly validate a value', () => {
      const value = 12.5;
      const validator = index.buildValidator(value);

      const result = validateConstraints(validator, constraints);

      assert.equal(result, true)
    });

    it('should throw for lower value', () => {
      const value = constraints[CONSTRAINT_MIN] - 1;
      const validator = index.buildValidator(value);

      try {
        validateConstraints(validator, constraints);
        assert(false);
      } catch (e) {
        assert.deepEqual(
          e, {
            code: ERROR_CODE_VALIDATION,
            id: ERROR_MIN_DECEEDED,
            args: {
              min: constraints[CONSTRAINT_MIN]
            }
          }
        )
      }
    });

    it('should throw for higher value', () => {
      const value = constraints[CONSTRAINT_MAX] + 1;
      const validator = index.buildValidator(value);

      try {
        validateConstraints(validator, constraints);
        assert(false);
      } catch (e) {
        assert.deepEqual(
          e, {
            code: ERROR_CODE_VALIDATION,
            id: ERROR_MAX_EXCEEDED,
            args: {
              max: constraints[CONSTRAINT_MAX]
            }
          }
        )
      }
    });
  });
});
