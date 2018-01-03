import { expect } from 'chai';
import converter from './integerUiType';

describe('fieldTypes :: boolean <-> integer', () => {
  describe('format', () => {
    it('should return 1 for true', () => {
      expect(converter.format({ value: true })).to.equal(1);
    });
    it('should return 0 for false', () => {
      expect(converter.format({ value: false })).to.equal(0);
    });
  })

  describe('parse', () => {
    it('should return false for 0', () => {
      expect(converter.parse({ value: 0 })).to.equal(false);
      expect(converter.parse({ value: -0 })).to.equal(false);
    });
    it('should return true for any integer !== 0', () => {
      expect(converter.parse({ value: 12 })).to.equal(true);
      expect(converter.parse({ value: -124 })).to.equal(true);
    });
  })
});
