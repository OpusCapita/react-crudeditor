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

describe('fieldTypes :: stringDate', () => {
  describe('isValid', () => {
    it('should return true for null', () => {
      assert.equal(index.isValid(null), true)
    });

    it('should return false for not date-like string', () => {
      assert.equal(index.isValid('dfssddsf'), false)
    });

    it('should return false for undefined, number or boolean', () => {
      assert.equal(index.isValid(undefined), false)
      assert.equal(index.isValid(234), false)
      assert.equal(index.isValid(true), false)
    });
  });

  describe('buildValidator', () => {
    const constraints = {
      [CONSTRAINT_MIN]: '2011-10-10',
      [CONSTRAINT_MAX]: '2017-04-12'
    }

    it('should properly validate a value', () => {
      const value = '2015-04-07';
      const validator = index.buildValidator(value);

      const result = validateConstraints(validator, constraints);

      assert.equal(result, true)
    });

    it('should throw for lower value', () => {
      const value = '2009-01-01';
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
              payload: constraints[CONSTRAINT_MIN]
            }
          }
        )
      }
    });

    it('should throw for higher value', () => {
      const value = '2018-06-02';
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
              payload: constraints[CONSTRAINT_MAX]
            }
          }
        )
      }
    });
  });
});
