import { I18nManager } from '@opuscapita/i18n';
import { expect } from 'chai';
import { getModelMessage } from './lib';

const i18n = new I18nManager();

const bundle = {
  en: {
    "model.field.contractId": "one",
    "crud.prefix.model.field.status": "two"
  }
}

i18n.register('component', bundle);

describe("components lib.js", _ => {
  describe("getModelMessage", _ => {
    it("should return translation for clear key", () => {
      const key = "model.field.contractId";
      const message = getModelMessage(i18n, key);
      expect(message).to.equal(bundle.en[key]); // eslint-disable-line no-unused-expressions
    });
    it("should return translation for prefixed key", () => {
      const message = getModelMessage(i18n, "model.field.status", "status");
      expect(message).to.equal("Status"); // eslint-disable-line no-unused-expressions
    });
  });
});
