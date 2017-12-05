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
  format: value => String(value),

  /*
   * █████████████████████████████████████████████████
   * ████  FIELD_TYPE_DECIMAL  ◄  UI_TYPE_STRING  ████
   * █████████████████████████████████████████████████
   */
  parse: value => {
    const optimized = value.trim();

    if (!optimized) {
      return EMPTY_FIELD_VALUE; // Considering whitespaces-only strings to be empty value.
    }

    let n = parseFloat(optimized);

    if (isNaN(optimized) || isNaN(n) || String(n) !== optimized) {
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
