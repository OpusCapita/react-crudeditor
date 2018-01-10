export const titleCase = str => typeof str === 'string' ?
  str.charAt(0).toUpperCase() + str.slice(1).replace(/[^A-Z](?=[A-Z])/g, '$&\u00A0') :
  str;

export function getModelMessage(request) {
  const { i18n, key, args, defaultMessage } = request;

  // If i18n doesn't find a message by key, it returns the key itself.
  // Optinal third argument defines default message for such a case.
  const message = i18n.getMessage(key, args);

  return message.slice(-key.length) === key && request.hasOwnProperty('defaultMessage') ?
    defaultMessage :
    message;
}

export const exists = v => v !== null && v !== undefined;

export const noop = _ => {};
