import { expect } from 'chai';
import assert from 'assert';
import {
  ERROR_CODE_PARSING,
  EMPTY_FIELD_VALUE,
  ERROR_INVALID_DATE
} from '../../constants';
import converter from './stringUiType';

describe('fieldTypes :: stringDate <-> string', () => {
  describe('format', () => {
    it('should convert stringified date to string', () => {
      const value = new Date().toISOString();
      const result = converter.format(value);

      expect(result).to.equal(new Date(value).toString())
    });
  });

  describe('parse', () => {
    it('should convert empty string into null', () => {
      const value = '';
      const result = converter.parse(value);

      expect(result).to.equal(EMPTY_FIELD_VALUE)
    });

    it('should convert stringified date into stringDate', () => {
      const value = new Date().toString();
      const result = converter.parse(value);

      expect(result).to.equal(new Date(value).toISOString())
    });

    it('should throw for not date-like string', () => {
      const value = 'ewqrwerew';

      try {
        converter.parse(value);
        assert(false)
      } catch (e) {
        assert.deepEqual(
          e, {
            code: ERROR_CODE_PARSING,
            id: ERROR_INVALID_DATE,
            message: 'Invalid date'
          }
        )
      }
    })
  })
});
