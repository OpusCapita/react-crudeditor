import { expect, assert } from 'chai';
import converter from './stringUiType';
import {
  ERROR_CODE_PARSING,
  ERROR_INVALID_BOOLEAN
} from '../../constants';

describe('fieldTypes :: boolean <-> string', () => {
  describe('format', () => {
    it('should return + for true', () => {
      expect(converter.format(true)).to.equal('+');
    });
    it('should return - for false', () => {
      expect(converter.format(false)).to.equal('-');
    });
  })

  describe('parse', () => {
    it('should return null for empty string', () => {
      expect(converter.parse('')).to.equal(null);
    });

    it(`should return true for ['+', 'yes', 'true', 'on', 'ok']`, () => {
      expect(converter.parse('+')).to.equal(true);
      expect(converter.parse('yes')).to.equal(true);
      expect(converter.parse('true')).to.equal(true);
      expect(converter.parse('on')).to.equal(true);
      expect(converter.parse('ok')).to.equal(true);
    });

    it(`should return false for ['-', 'no', 'false', 'off']`, () => {
      expect(converter.parse('-')).to.equal(false);
      expect(converter.parse('no')).to.equal(false);
      expect(converter.parse('false')).to.equal(false);
      expect(converter.parse('off')).to.equal(false);
    });

    it(`should throw for unknown string`, () => {
      try {
        converter.parse('weewew');
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
