import { expect } from 'chai';
import uiTypeBoolean from './boolean';
import uiTypeDate from './date';

describe("data-types-lib :: uiTypes", _ => {
  describe("boolean", _ => {
    it("should return null as empty value", () => {
      expect(uiTypeBoolean.EMPTY_VALUE).to.equal(null); // eslint-disable-line no-unused-expressions
    });

    it("should treat null as a valid value", () => {
      expect(uiTypeBoolean.isValid(null)).to.be.true; // eslint-disable-line no-unused-expressions
    });

    it("should treat true/false as a valid value", () => {
      expect(uiTypeBoolean.isValid(true)).to.be.true; // eslint-disable-line no-unused-expressions
      expect(uiTypeBoolean.isValid(false)).to.be.true; // eslint-disable-line no-unused-expressions
    });

    it("should treat other types as invalid value", () => {
      expect(uiTypeBoolean.isValid('true')).to.be.false; // eslint-disable-line no-unused-expressions
      expect(uiTypeBoolean.isValid('false')).to.be.false; // eslint-disable-line no-unused-expressions
      expect(uiTypeBoolean.isValid('')).to.be.false; // eslint-disable-line no-unused-expressions
      expect(uiTypeBoolean.isValid([])).to.be.false; // eslint-disable-line no-unused-expressions
      expect(uiTypeBoolean.isValid({})).to.be.false; // eslint-disable-line no-unused-expressions
      expect(uiTypeBoolean.isValid(undefined)).to.be.false; // eslint-disable-line no-unused-expressions
      expect(uiTypeBoolean.isValid(0)).to.be.false; // eslint-disable-line no-unused-expressions
      expect(uiTypeBoolean.isValid(-100)).to.be.false; // eslint-disable-line no-unused-expressions
    });
  });

  describe("date", _ => {
    it("should return null as empty value", () => {
      expect(uiTypeDate.EMPTY_VALUE).to.equal(null); // eslint-disable-line no-unused-expressions
    });

    it("should treat null as a valid value", () => {
      expect(uiTypeDate.isValid(null)).to.be.true; // eslint-disable-line no-unused-expressions
    });

    it("should treat Date as a valid value", () => {
      expect(uiTypeDate.isValid(new Date())).to.be.true; // eslint-disable-line no-unused-expressions
      expect(uiTypeDate.isValid(new Date('10/10/2010'))).to.be.true; // eslint-disable-line no-unused-expressions
    });

    it("should treat other types as invalid value", () => {
      expect(uiTypeDate.isValid(true)).to.be.false; // eslint-disable-line no-unused-expressions
      expect(uiTypeDate.isValid(false)).to.be.false; // eslint-disable-line no-unused-expressions
      expect(uiTypeDate.isValid('')).to.be.false; // eslint-disable-line no-unused-expressions
      expect(uiTypeDate.isValid('wewerw')).to.be.false; // eslint-disable-line no-unused-expressions
      expect(uiTypeDate.isValid([])).to.be.false; // eslint-disable-line no-unused-expressions
      expect(uiTypeDate.isValid({})).to.be.false; // eslint-disable-line no-unused-expressions
      expect(uiTypeDate.isValid(undefined)).to.be.false; // eslint-disable-line no-unused-expressions
      expect(uiTypeDate.isValid(0)).to.be.false; // eslint-disable-line no-unused-expressions
      expect(uiTypeDate.isValid(-100)).to.be.false; // eslint-disable-line no-unused-expressions
    });
  });
});
