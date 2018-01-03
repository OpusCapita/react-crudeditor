import { expect, assert } from 'chai';
import converter from './stringUiType';
import {
  ERROR_CODE_PARSING,
  ERROR_INVALID_BOOLEAN
} from '../../constants';

describe('fieldTypes :: boolean <-> string', () => {
  describe('format', () => {
    it('should return + for true', () => {
      expect(converter.format({ value: true })).to.equal('+');
    });
    it('should return - for false', () => {
      expect(converter.format({ value: false })).to.equal('-');
    });
  })

  describe('parse', () => {
    it('should return null for empty string', () => {
      expect(converter.parse({ value: '' })).to.equal(null);
    });

    it(`should return true for ['+', 'yes', 'true', 'on', 'ok']`, () => {
      expect(converter.parse({ value: '+' })).to.equal(true);
      expect(converter.parse({ value: 'yes' })).to.equal(true);
      expect(converter.parse({ value: 'true' })).to.equal(true);
      expect(converter.parse({ value: 'on' })).to.equal(true);
      expect(converter.parse({ value: 'ok' })).to.equal(true);
    });

    it(`should return false for ['-', 'no', 'false', 'off']`, () => {
      expect(converter.parse({ value: '-' })).to.equal(false);
      expect(converter.parse({ value: 'no' })).to.equal(false);
      expect(converter.parse({ value: 'false' })).to.equal(false);
      expect(converter.parse({ value: 'off' })).to.equal(false);
    });

    it(`should throw for unknown string`, () => {
      try {
        converter.parse({ value: 'weewew' });
        assert(false);
      } catch (e) {
        assert.deepEqual(
          e, {
            code: ERROR_CODE_PARSING,
            id: ERROR_INVALID_BOOLEAN,
            message: 'Unable to parse string as boolean value'
          }
        )
      }
    });
  })
});
