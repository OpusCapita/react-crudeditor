import {
  ERROR_CODE_PARSING,
  EMPTY_FIELD_VALUE,
  ERROR_INVALID_DECIMAL
} from '../../constants';

export default {

  /*
   * █████████████████████████████████████████████████
   * ████  FIELD_TYPE_DECIMAL  ►  UI_TYPE_STRING  ████
   * █████████████████████████████████████████████████
   */
  format: (value, { i18n } = {}) => value === EMPTY_FIELD_VALUE ?
    String(value) :
    i18n.formatDecimalNumber(value),

  /*
   * █████████████████████████████████████████████████
   * ████  FIELD_TYPE_DECIMAL  ◄  UI_TYPE_STRING  ████
   * █████████████████████████████████████████████████
   */
  parse: (value, { i18n }) => {
    let optimized;

    try {
      optimized = i18n.parseDecimalNumber(value || '')
    } catch (err) {
      throw err
    }

    if (isNaN(optimized)) {
      const error = {
        code: ERROR_CODE_PARSING,
        id: ERROR_INVALID_DECIMAL,
        message: 'Invalid decimal number'
      };

      throw error;
    }

    return optimized;
  }
};
