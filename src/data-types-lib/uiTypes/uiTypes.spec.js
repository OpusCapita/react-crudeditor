import { expect } from 'chai';
import uiTypeBoolean from './boolean';
import uiTypeDate from './date';

describe("data-types-lib :: uiTypes", _ => {
  describe("boolean", _ => {
    it("should return null as empty value", () => {
      expect(uiTypeBoolean.EMPTY_VALUE).to.equal(null);
    });

    it("should treat null as a valid value", () => {
      expect(uiTypeBoolean.isValid(null)).to.be.true;
    });

    it("should treat true/false as a valid value", () => {
      expect(uiTypeBoolean.isValid(true)).to.be.true;
      expect(uiTypeBoolean.isValid(false)).to.be.true;
    });

    it("should treat other types as invalid value", () => {
      expect(uiTypeBoolean.isValid('true')).to.be.false;
      expect(uiTypeBoolean.isValid('false')).to.be.false;
      expect(uiTypeBoolean.isValid('')).to.be.false;
      expect(uiTypeBoolean.isValid([])).to.be.false;
      expect(uiTypeBoolean.isValid({})).to.be.false;
      expect(uiTypeBoolean.isValid(undefined)).to.be.false;
      expect(uiTypeBoolean.isValid(0)).to.be.false;
      expect(uiTypeBoolean.isValid(-100)).to.be.false;
    });
  });

  describe("date", _ => {
    it("should return null as empty value", () => {
      expect(uiTypeDate.EMPTY_VALUE).to.equal(null);
    });

    it("should treat null as a valid value", () => {
      expect(uiTypeDate.isValid(null)).to.be.true;
    });

    it("should treat Date as a valid value", () => {
      expect(uiTypeDate.isValid(new Date())).to.be.true;
      expect(uiTypeDate.isValid(new Date('10/10/2010'))).to.be.true;
    });

    it("should treat other types as invalid value", () => {
      expect(uiTypeDate.isValid(true)).to.be.false;
      expect(uiTypeDate.isValid(false)).to.be.false;
      expect(uiTypeDate.isValid('')).to.be.false;
      expect(uiTypeDate.isValid('wewerw')).to.be.false;
      expect(uiTypeDate.isValid([])).to.be.false;
      expect(uiTypeDate.isValid({})).to.be.false;
      expect(uiTypeDate.isValid(undefined)).to.be.false;
      expect(uiTypeDate.isValid(0)).to.be.false;
      expect(uiTypeDate.isValid(-100)).to.be.false;
    });
  });
});
