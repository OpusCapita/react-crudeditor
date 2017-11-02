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
  },

  // TODO maybe refactor the following crazy function somehow
  // it works but looks like a spell to summon satan
  //
  // inputs:
  // errors: errors.fields from reducer
  // showErrors: mirrored structure to errors, but end values are true/false
  errorsExistAndVisible = (errors, showErrors) =>
  !!Object.keys(showErrors).
    filter(
      f => typeof showErrors[f] === 'object' ?
        Object.keys(showErrors[f]).some(k => showErrors[f][k]) :
        showErrors[f]
    ).
    // here we have fields which are set to be true in showErrors
    // now we need to check if there are actual errors for these fields
    some(f => errors[f] && (
      Array.isArray(errors[f]) ?
        errors[f].length > 0 :
        ['to', 'from'].some(k => ~Object.keys(errors[f]).indexOf(k) && Array.isArray(errors[f][k]) && errors[f][k].length > 0)
    ));
