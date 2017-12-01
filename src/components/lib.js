export const getModelMessage = (i18n, key, defaultKey) => {
  const message = i18n.getMessage(key);

  // if @opuscapita/i18n doesn't find a message by key, it returns the key itself
  return (message.indexOf(key) + key.length) === message.length && defaultKey ?
    defaultKey.charAt(0).toUpperCase() + defaultKey.slice(1).replace(/[^A-Z](?=[A-Z])/g, '$&\u00A0') :
    message;
}

export const isDef = v => v !== null && v !== undefined;
