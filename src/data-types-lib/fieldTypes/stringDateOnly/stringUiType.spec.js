import { expect } from 'chai';
import assert from 'assert';
import {
  ERROR_CODE_PARSING,
  EMPTY_FIELD_VALUE,
  ERROR_INVALID_DATE
} from '../../constants';
import converter from './stringUiType';

describe('fieldTypes :: stringDateOnly <-> string', () => {
  describe('format', () => {
    it('should convert stringified date to string', () => {
      const value = new Date().toISOString().slice(0, 10);
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

    // it('should convert stringified date into stringDateOnly', () => {
    //   const date = new Date();
    //   const value = date.toString();
    //   const result = converter.parse(value);
    //
    //   expect(result).to.equal(`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`)
    // });

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
