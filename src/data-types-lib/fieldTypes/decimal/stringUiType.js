import {
  ERROR_CODE_PARSING,
  ERROR_INVALID_DECIMAL
} from '../../constants';

export default {

  /*
   * █████████████████████████████████████████████████
   * ████  FIELD_TYPE_DECIMAL  ►  UI_TYPE_STRING  ████
   * █████████████████████████████████████████████████
   */
  format: (value, i18n) => i18n.formatDecimalNumber(value),

  /*
   * █████████████████████████████████████████████████
   * ████  FIELD_TYPE_DECIMAL  ◄  UI_TYPE_STRING  ████
   * █████████████████████████████████████████████████
   */
  parse: (value, i18n) => {
    let n;

    try {
      n = i18n.parseDecimalNumber(value || null)
    } catch (err) {
      if (err.name === 'ParseError') {
        err = { // eslint-disable-line no-ex-assign
          code: ERROR_CODE_PARSING,
          id: ERROR_INVALID_DECIMAL,
          message: 'Invalid decimal number'
        }
      }

      throw err;
    }

    if (isNaN(n)) {
      const error = {
        code: ERROR_CODE_PARSING,
        id: ERROR_INVALID_DECIMAL,
        message: 'Invalid decimal number'
      };

      throw error;
    }

    return n;
  }
};
