import { expect } from 'chai';
import converter from './decimalUiType';

describe('fieldTypes :: boolean <-> decimal', () => {
  describe('format', () => {
    it('should return 1 for true', () => {
      expect(converter.format(true)).to.equal(1);
    });
    it('should return 0 for false', () => {
      expect(converter.format(false)).to.equal(0);
    });
  })

  describe('parse', () => {
    it('should return false for 0', () => {
      expect(converter.parse(0)).to.equal(false);
      expect(converter.parse(-0)).to.equal(false);
    });
    it('should return true for any integer !== 0', () => {
      expect(converter.parse(12.23)).to.equal(true);
      expect(converter.parse(-124.234)).to.equal(true);
    });
  })
});
