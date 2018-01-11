import { expect, assert } from 'chai';
import omit from 'lodash/omit';
import { I18nManager } from '@opuscapita/i18n';
import { converter, validate } from './';
import {
  UI_TYPE_STRING,
  FIELD_TYPE_INTEGER,
  ERROR_CODE_FORMATING,
  ERROR_CODE_PARSING,
  ERROR_CODE_VALIDATION,
  ERROR_REQUIRED_MISSING,
  ERROR_INVALID_FIELD_TYPE_VALUE,
  ERROR_INVALID_UI_TYPE_VALUE,
  ERROR_MAX_EXCEEDED,
  ERROR_UNKNOWN_CONSTRAINT,
  EMPTY_FIELD_VALUE,
  CONSTRAINT_MIN,
  CONSTRAINT_MAX
} from './constants';
import uiTypeString from './uiTypes/string';

const i18n = new I18nManager();

describe('data-types-lib', () => {
  describe('converter', () => {
    const isConv = converter({
      fieldType: FIELD_TYPE_INTEGER,
      uiType: UI_TYPE_STRING
    });

    it('should create proper converter for known types', () => {
      expect(isConv).to.have.ownProperty('format');
      expect(isConv).to.have.ownProperty('parse');

      expect(isConv.format({ value: 102, i18n })).to.equal('102');
      expect(isConv.parse({ value: '102', i18n })).to.equal(102);
    });

    it('should return undefined for unknown type(s)', () => {
      const conv1 = converter({
        fieldType: 'quwgde6 236 e2i8t7ore837r92y3r92rg23r832r83h3f8239pfhdfh 239',
        uiType: UI_TYPE_STRING
      });

      const conv2 = converter({
        fieldType: FIELD_TYPE_INTEGER,
        uiType: 'quwgde6 236 e2i8t7ore837r92y3r92rg23r832r83h3f8239pfhdfh 239'
      });

      const conv3 = converter({
        fieldType: 'wdshf 29 yh;py2;urh;23yh r02y83 [08 ryu2',
        uiType: 'quwgde6 236 e2i8t7ore837r92y3r92rg23r832r83h3f8239pfhdfh 239'
      });

      expect(conv1).to.not.exist; // eslint-disable-line no-unused-expressions
      expect(conv2).to.not.exist; // eslint-disable-line no-unused-expressions
      expect(conv3).to.not.exist; // eslint-disable-line no-unused-expressions
    });

    describe('format', () => {
      it('should throw for bad input', () => {
        const value = '102';
        try {
          isConv.format({ value, i18n });
          assert(false)
        } catch (e) {
          assert.deepEqual(
            e, {
              code: ERROR_CODE_FORMATING,
              id: ERROR_INVALID_FIELD_TYPE_VALUE,
              message: `Invalid value "${value}" of Field Type "${FIELD_TYPE_INTEGER}"`
            }
          )
        }
      });

      it('should return empty UI value for empty field value input', () => {
        const value = EMPTY_FIELD_VALUE;
        expect(isConv.format({ value })).to.equal(uiTypeString.EMPTY_VALUE)
      });
    });

    describe('parse', () => {
      it('should throw for bad input', () => {
        const value = 102;
        try {
          isConv.parse({ value, i18n });
          assert(false)
        } catch (e) {
          assert.deepEqual(
            e, {
              code: ERROR_CODE_PARSING,
              id: ERROR_INVALID_UI_TYPE_VALUE,
              message: `Invalid value "${value}" of UI Type "${UI_TYPE_STRING}"`
            }
          )
        }
      });

      it('should return empty field value given empty ui value input', () => {
        const value = uiTypeString.EMPTY_VALUE;
        expect(isConv.parse({ value })).to.equal(EMPTY_FIELD_VALUE)
      });
    });
  });

  describe('validate', () => {
    const forbiddenValue = 33;

    const customErr = {
      message: '33 is taken!'
    }

    const customValidate = value => {
      if (value === forbiddenValue) {
        throw customErr
      }
    }

    const constraints = {
      required: true,
      [CONSTRAINT_MIN]: -20,
      [CONSTRAINT_MAX]: 50,
      validate: customValidate
    };

    const validateInt = validate({
      type: FIELD_TYPE_INTEGER,
      constraints
    })

    it('should create a validate function for known field type', () => {
      expect(validateInt).to.be.instanceof(Function)
    });

    it('should return undefined for unknown field type', () => {
      expect(validate({ type: 'random_783B<2711##!%v', constraints: {} })). // eslint-disable-line no-unused-expressions
        to.not.exist
    });

    it('should return true for successful validation', () => {
      const value = constraints[CONSTRAINT_MIN] + 1;
      expect(validateInt(value)).to.equal(true)
    });

    it('should throw custom error if custom validate fails', () => {
      const value = forbiddenValue;

      try {
        validateInt(value)
        assert(false)
      } catch (e) {
        assert.deepEqual(e, [customErr])
      }
    });

    it('should throw for empty field value if value is required', () => {
      try {
        validateInt(EMPTY_FIELD_VALUE)
        assert(false)
      } catch (e) {
        assert.deepEqual(e, [{
          code: ERROR_CODE_VALIDATION,
          id: ERROR_REQUIRED_MISSING,
          message: 'Required value must be set'
        }])
      }
    });

    it('should not throw for empty field value if value is not required', () => {
      const validateNotRequired = validate({
        type: FIELD_TYPE_INTEGER,
        constraints: omit(constraints, ['required'])
      });

      expect(validateNotRequired(EMPTY_FIELD_VALUE)).to.be.true; // eslint-disable-line no-unused-expressions
    });

    it('should throw for unmet constraint', () => {
      const value = constraints[CONSTRAINT_MAX] + 1;

      try {
        validateInt(value);
        assert(false)
      } catch (e) {
        assert.deepEqual(e, [{
          code: ERROR_CODE_VALIDATION,
          id: ERROR_MAX_EXCEEDED,
          args: {
            max: constraints[CONSTRAINT_MAX]
          }
        }])
      }
    });

    it('should throw for unknown constraint', () => {
      const value = constraints[CONSTRAINT_MAX] - 1;

      const unknownConstraint = {
        someUnknownThing: 'my funky value'
      }

      const validateWithUnknownConstraints = validate({
        type: FIELD_TYPE_INTEGER,
        constraints: {
          ...constraints,
          ...unknownConstraint
        }
      })

      try {
        validateWithUnknownConstraints(value);
        assert(false)
      } catch (e) {
        assert.deepEqual(e, [{
          code: ERROR_CODE_VALIDATION,
          id: ERROR_UNKNOWN_CONSTRAINT,
          message: `Unable to validate against unknown constraint "${Object.keys(unknownConstraint)[0]}"`
        }])
      }
    });
  });
});
