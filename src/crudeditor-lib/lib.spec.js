import { expect } from 'chai';
import { I18nManager } from '@opuscapita/i18n';
import {
  getModelMessage,
  addMessagesToFields,
  titleCase
} from './lib';

const i18n = new I18nManager();

const messages = {
  en: {
    'model.field.one.label': 'one label',
    'model.field.one.tooltip': 'one tooltip',
    'model.field.one.hint': 'one hint',

    'model.field.two.label': 'two label',
    'model.field.two.tooltip': 'two tooltip',

    'model.field.three.label': 'three label',
    'model.field.three.hint': 'three hint',

    'model.field.four.label': 'four label',
  }
};

i18n.register('Test', messages);

describe('crudeditor-lib / lib', () => {
  describe('titleCase', () => {
    it('should create a Title Case message from camelCase id', () => {
      expect(titleCase('word')).to.equal('Word');
      expect(titleCase('someId')).to.equal('Some\u00A0Id');
      expect(titleCase('someFieldName')).to.equal('Some\u00A0Field\u00A0Name');
    });
  });

  describe("getModelMessage", _ => {
    it("should return translation for clear key", () => {
      const key = "model.field.one.label";
      const message = getModelMessage(i18n, key);
      expect(message).to.equal(messages.en[key]); // eslint-disable-line no-unused-expressions
    });

    it("should return translation for prefixed key", () => {
      const message = getModelMessage(i18n, "model.field.status.label", "status");
      expect(message).to.equal("Status"); // eslint-disable-line no-unused-expressions
    });
  });

  describe('addMessagesToFields', () => {
    const fields = {
      one: { type: 'something' },
      two: { type: 'something' },
      three: { type: 'something' },
      four: { type: 'something' },
      five: { type: 'something' },
    }

    const newFields = addMessagesToFields({ fields, i18n });

    it('should add label, tooltip and hint to each field if exists', () => {
      expect(newFields).to.be.an('object');
      expect(newFields.one).to.have.all.keys('type', 'label', 'tooltip', 'hint');
      expect(newFields.two).to.have.all.keys('type', 'label', 'tooltip').but.not.key('hint');
      expect(newFields.three).to.have.all.keys('type', 'label', 'hint').but.not.key('tooltip');
      expect(newFields.four).to.have.all.keys('type', 'label').but.not.all.keys('tooltip', 'hint');
      expect(newFields.five).to.have.all.keys('type', 'label').but.not.all.keys('tooltip', 'hint');
    });

    it('should handle messages properly', () => {
      const msgs = messages.en;
      expect(newFields.one.label).to.equal(msgs['model.field.one.label']);
      expect(newFields.one.tooltip).to.equal(msgs['model.field.one.tooltip']);
      expect(newFields.one.hint).to.equal(msgs['model.field.one.hint']);
      expect(newFields.five.label).to.equal(titleCase('five'));
    })
  });
})
