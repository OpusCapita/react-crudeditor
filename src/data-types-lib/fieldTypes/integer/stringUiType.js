import {
  ERROR_CODE_PARSING,
  ERROR_INVALID_INTEGER
} from '../../constants';

export default {

  /*
   * █████████████████████████████████████████████████
   * ████  FIELD_TYPE_INTEGER  ►  UI_TYPE_STRING  ████
   * █████████████████████████████████████████████████
   */
  format: ({ value, i18n }) => i18n.formatNumber(value),

  /*
   * █████████████████████████████████████████████████
   * ████  FIELD_TYPE_INTEGER  ◄  UI_TYPE_STRING  ████
   * █████████████████████████████████████████████████
   */
  parse: ({ value, i18n }) => {
    let n;

    try {
      n = i18n.parseNumber(value || null)
    } catch (err) {
      if (err.name === 'ParseError') {
        err = { // eslint-disable-line no-ex-assign
          code: ERROR_CODE_PARSING,
          id: ERROR_INVALID_INTEGER,
          message: 'Invalid integer'
        }
      }
      throw err
    }

    if (isNaN(n)) {
      const error = {
        code: ERROR_CODE_PARSING,
        id: ERROR_INVALID_INTEGER,
        message: 'Invalid integer'
      };

      throw error;
    }

    return n;
  }
};
