import { expect } from 'chai';
import { isDef } from './lib';

describe("components lib.js", _ => {
  describe("isDef", _ => {
    it("should return false for null", () => {
      const result = isDef(null);
      expect(result).to.be.false; // eslint-disable-line no-unused-expressions
    });

    it("should return false for undefined", () => {
      const result = isDef(undefined);
      expect(result).to.be.false; // eslint-disable-line no-unused-expressions
    });

    it("should return true for 0", () => {
      const result = isDef(0);
      expect(result).to.be.true; // eslint-disable-line no-unused-expressions
    });

    it("should return true for empty string", () => {
      const result = isDef('');
      expect(result).to.be.true; // eslint-disable-line no-unused-expressions
    });
  });
});
