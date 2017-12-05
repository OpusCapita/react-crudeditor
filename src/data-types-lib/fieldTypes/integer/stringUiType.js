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
  format: value => String(value),

  /*
   * █████████████████████████████████████████████████
   * ████  FIELD_TYPE_INTEGER  ◄  UI_TYPE_STRING  ████
   * █████████████████████████████████████████████████
   */
  parse: value => {
    const optimized = value.trim();

    if (!optimized) {
      return EMPTY_FIELD_VALUE; // Considering whitespaces-only strings to be empty value.
    }

    let n = parseInt(optimized, 10);

    if (isNaN(optimized) || isNaN(n) || String(n) !== optimized) {
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
