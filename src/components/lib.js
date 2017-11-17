export const

  getTabText = (i18n, key) => i18n.getModelMessage('tab')(key),

  getSectionText = (i18n, key) => i18n.getModelMessage('section')(key),

  getFieldText = (i18n, key) => i18n.getModelMessage('field')(key),

  getModelName = i18n => i18n.getModelMessage('name')();
