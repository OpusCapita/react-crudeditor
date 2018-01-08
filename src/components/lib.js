const titleCase = str => typeof str === 'string' ?
  str.charAt(0).toUpperCase() + str.slice(1).replace(/[^A-Z](?=[A-Z])/g, '$&\u00A0') :
  str;

export function getModelMessage(i18n, key, default) {
// If i18n doesn't find a message by key, it returns the key itself.
// Optinal third argument defines default for such a case.

  const message = i18n.getMessage(key);

  return message.slice(-key.length) === key && arguments.length === 3 ?
    titleCase(default) :
    message;
}

export const isDef = v => v !== null && v !== undefined;

export const noop = _ => {};
