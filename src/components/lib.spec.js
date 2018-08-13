import { I18nManager } from '@opuscapita/i18n';
import { expect } from 'chai';
import { getModelMessage, exists, titleCase } from './lib';

const i18n = new I18nManager();

const bundle = {
  en: {
    "model.field.contractId": "one",
    "crud.prefix.model.field.status": "two"
  }
}

i18n.register('component', bundle);

describe("components lib.js", _ => {
  describe("titleCase", _ => {
    it("should transform camelCase to Title Case", () => {
      const message = 'maxOrderValue';
      expect(titleCase(message)).to.equal('Max Order Value');
    });

    it("should return arg if it's not a string", () => {
      const notString = {};
      expect(titleCase(notString)).to.deep.equal(notString);
    });
  });

  describe("getModelMessage", _ => {
    it("should return translation for clear key", () => {
      const key = "model.field.contractId";
      const message = getModelMessage({ i18n, key });
      expect(message).to.equal(bundle.en[key]); // eslint-disable-line no-unused-expressions
    });

    it("should return translation for prefixed key", () => {
      const message = getModelMessage({ i18n, key: "model.field.status", defaultMessage: titleCase("status") });
      expect(message).to.equal("Status"); // eslint-disable-line no-unused-expressions
    });

    it("should return null for unknown key and null as third parameter", () => {
      const message = getModelMessage({ i18n, key: "model.field.something_&%5v^^@_random", defaultMessage: null });
      expect(message).to.equal(null); // eslint-disable-line no-unused-expressions
    });
  });

  describe("exists", _ => {
    it("should return false for null", () => {
      const result = exists(null);
      expect(result).to.be.false; // eslint-disable-line no-unused-expressions
    });

    it("should return false for undefined", () => {
      const result = exists(undefined);
      expect(result).to.be.false; // eslint-disable-line no-unused-expressions
    });

    it("should return true for 0", () => {
      const result = exists(0);
      expect(result).to.be.true; // eslint-disable-line no-unused-expressions
    });

    it("should return true for empty string", () => {
      const result = exists('');
      expect(result).to.be.true; // eslint-disable-line no-unused-expressions
    });
  });
});
