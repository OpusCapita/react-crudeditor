import Section from './EditSection';
import Field from './EditField';

const getText = type => (source, key) => {
  const
    msgKey = `model.${type}.${key}`,
    i18nText = source.getMessage(msgKey);

  // if i18n doesn't find a message by key, it returns the key itself
  return i18nText !== msgKey ?
    i18nText :
    key.charAt(0).toUpperCase() + key.slice(1).replace(/[^A-Z](?=[A-Z])/g, '$&\u00A0')
}

export const

  getTabText = getText('tab'),

  getSectionText = getText('section'),

  getFieldText = getText('field'),

  formatEntry = entry => entry.field ? {
    Entry: Field,
    props: {
      entry: {
        name: entry.field,
        readOnly: entry.readOnly,
        Component: entry.render.Component,
        valuePropName: entry.render.valueProp.name
      }
    }
  } : {
    Entry: Section,
    fields: entry.map(formatEntry), // Section always has at least one field.
    props: {
      // title: entry.section.replace(/(^|\s)[a-z]/g, char => char.toUpperCase())
      title: entry.section
    }
  };
