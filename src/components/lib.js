import {
  ERROR_INVALID_DATE,
  ERROR_INVALID_INTEGER,
  ERROR_INVALID_DECIMAL,
  ERROR_MIN_DECEEDED,
  ERROR_MAX_EXCEEDED,
  ERROR_REQUIRED_MISSING,
  ERROR_INVALID_EMAIL,
  ERROR_INVALID_URL,
  ERROR_REGEX_DOESNT_MATCH,
  ERROR_MIN_SIZE_DECEEDED,
  ERROR_MAX_SIZE_EXCEEDED
} from '../data-types-lib/constants';

export const exists = v => v !== null && v !== undefined;

export const noop = _ => {};

export const titleCase = str => typeof str === 'string' ?
  str.charAt(0).toUpperCase() + str.slice(1).replace(/[^A-Z](?=[A-Z])/g, '$&\u00A0') :
  str;

export const getModelMessage = request => {
  const { i18n, key, args, defaultMessage } = request;

  // If i18n doesn't find a message by key, it returns the key itself.
  // Optinal 'defaultMessage' defines default message for such a case.
  const message = i18n.getMessage(key, args);

  return message.slice(-key.length) === key && request.hasOwnProperty('defaultMessage') ?
    defaultMessage :
    message;
}

export const getFieldErrorMessage = ({ error, i18n, fieldName }) => {
  const { id, message, args } = error;

  const errorMessages = {
    [ERROR_MIN_DECEEDED]: "default.invalid.min.message",
    [ERROR_MAX_EXCEEDED]: "default.invalid.max.message",
    [ERROR_MIN_SIZE_DECEEDED]: "default.invalid.min.size.message",
    [ERROR_MAX_SIZE_EXCEEDED]: "default.invalid.max.size.message",
    [ERROR_REQUIRED_MISSING]: "default.blank.message",
    [ERROR_INVALID_INTEGER]: "default.invalid.integer.message",
    [ERROR_INVALID_DECIMAL]: "default.invalid.decimal.message",
    [ERROR_INVALID_DATE]: "default.invalid.date.message",
    [ERROR_INVALID_EMAIL]: "default.invalid.email.message",
    [ERROR_INVALID_URL]: "default.invalid.url.message",
    [ERROR_REGEX_DOESNT_MATCH]: "default.doesnt.match.message"
  }

  // crud internal translations for errors
  if (errorMessages[id]) {
    return i18n.getMessage(errorMessages[id], args)
  }

  // try to find a translation defined by model
  return getModelMessage({
    i18n,
    key: `model.field.${fieldName}.error.${id}`,
    args,
    defaultMessage: message || id
  })
}

export const getTabLabel = ({ i18n, name }) => getModelMessage({
  i18n,
  key: `model.tab.${name}.label`,
  defaultMessage: titleCase(name)
});

export const getFieldLabel = ({ i18n, name }) => getModelMessage({
  i18n,
  key: `model.field.${name}.label`,
  defaultMessage: titleCase(name)
})
