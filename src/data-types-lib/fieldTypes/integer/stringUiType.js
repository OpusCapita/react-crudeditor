import {
  ERROR_CODE_PARSING,
  EMPTY_FIELD_VALUE,
  ERROR_INVALID_INTEGER
} from '../../constants';

export default {

  /*
   * █████████████████████████████████████████████████
   * ████  FIELD_TYPE_INTEGER  ►  UI_TYPE_STRING  ████
   * █████████████████████████████████████████████████
   */
  format: ({ value, i18n }) => value === EMPTY_FIELD_VALUE ?
    String(value) :
    i18n.formatNumber(value),

  /*
   * █████████████████████████████████████████████████
   * ████  FIELD_TYPE_INTEGER  ◄  UI_TYPE_STRING  ████
   * █████████████████████████████████████████████████
   */
  parse: ({ value, i18n }) => {
    let optimized;

    try {
      optimized = i18n.parseNumber(value || null)
    } catch (err) {
      throw err;
    }

    if (isNaN(optimized)) {
      const error = {
        code: ERROR_CODE_PARSING,
        id: ERROR_INVALID_INTEGER,
        message: 'Invalid integer'
      };

      throw error;
    }

    return optimized;
  }
};
