const getText = type => (source, key) => {
  const
    msgKey = `${source.__crudEditor_modelPrefix}.model.${type}` + (key ? `.${key}` : ''),
    i18nText = source.getMessage(msgKey);

  // if i18n doesn't find a message by key, it returns the key itself
  // in this case we'are trying to make a readable title-case phrase
  return i18nText !== msgKey ?
    i18nText :
    key.charAt(0).toUpperCase() + key.slice(1).replace(/[^A-Z](?=[A-Z])/g, '$&\u00A0')
}

export const

  getTabText = getText('tab'),

  getSectionText = getText('section'),

  getFieldText = getText('field'),

  getModelName = getText('name');
