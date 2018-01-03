import { expect } from 'chai';
import uiTypeBoolean from './boolean';
import uiTypeDate from './date';
import uiTypeString from './string';
import uiTypeDecimal from './decimal';
import uiTypeInteger from './integer';

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

  describe("string", _ => {
    it("should return empty string as empty value", () => {
      expect(uiTypeString.EMPTY_VALUE).to.equal(''); // eslint-disable-line no-unused-expressions
    });

    it("should treat empty string as a valid value", () => {
      expect(uiTypeString.isValid('')).to.be.true; // eslint-disable-line no-unused-expressions
    });

    it("should treat string as a valid value", () => {
      expect(uiTypeString.isValid('sdsfewfew')).to.be.true; // eslint-disable-line no-unused-expressions
    });

    it("should treat other types as invalid value", () => {
      expect(uiTypeString.isValid(true)).to.be.false; // eslint-disable-line no-unused-expressions
      expect(uiTypeString.isValid(false)).to.be.false; // eslint-disable-line no-unused-expressions
      expect(uiTypeString.isValid(null)).to.be.false; // eslint-disable-line no-unused-expressions
      expect(uiTypeString.isValid(2323.56)).to.be.false; // eslint-disable-line no-unused-expressions
      expect(uiTypeString.isValid([])).to.be.false; // eslint-disable-line no-unused-expressions
      expect(uiTypeString.isValid({})).to.be.false; // eslint-disable-line no-unused-expressions
      expect(uiTypeString.isValid(undefined)).to.be.false; // eslint-disable-line no-unused-expressions
      expect(uiTypeString.isValid(0)).to.be.false; // eslint-disable-line no-unused-expressions
      expect(uiTypeString.isValid(-100)).to.be.false; // eslint-disable-line no-unused-expressions
    });
  });

  describe('decimal', () => {
    const vNumber = 14.8;
    const ivNumber = '23e';

    it('should return valid for decimal', () => {
      expect(uiTypeDecimal.isValid(vNumber)).to.be.true; // eslint-disable-line no-unused-expressions
    });

    it('should return valid for integer', () => {
      expect(uiTypeDecimal.isValid(parseInt(vNumber, 10))).to.be.true; // eslint-disable-line no-unused-expressions
    });

    it('should return valid for null', () => {
      expect(uiTypeDecimal.isValid(null)).to.be.true; // eslint-disable-line no-unused-expressions
    });

    it('should return null as empty value', () => {
      expect(uiTypeDecimal.EMPTY_VALUE).to.equal(null); // eslint-disable-line no-unused-expressions
    });

    it('should return invalid for not-a-decimal', () => {
      expect(uiTypeDecimal.isValid(ivNumber)).to.be.false; // eslint-disable-line no-unused-expressions
    });
  });

  describe('integer', () => {
    const vNumber = 14;
    const ivNumber = '23e';

    it('should return valid for integer', () => {
      expect(uiTypeInteger.isValid(vNumber)).to.be.true; // eslint-disable-line no-unused-expressions
    });

    it('should return valid for null', () => {
      expect(uiTypeInteger.isValid(null)).to.be.true; // eslint-disable-line no-unused-expressions
    });

    it('should return null as empty value', () => {
      expect(uiTypeInteger.EMPTY_VALUE).to.equal(null); // eslint-disable-line no-unused-expressions
    });

    it('should return invalid for not-a-number', () => {
      expect(uiTypeInteger.isValid(ivNumber)).to.be.false; // eslint-disable-line no-unused-expressions
    });

    it('should return invalid for decimal', () => {
      expect(uiTypeInteger.isValid(vNumber * 1.3)).to.be.false; // eslint-disable-line no-unused-expressions
    });
  });
});
