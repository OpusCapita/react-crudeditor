import {
  ERROR_CODE_PARSING,
  EMPTY_FIELD_VALUE,
  ERROR_INVALID_NUMBER
} from '../../constants';

export default {

  /*
   * ████████████████████████████████████████████████
   * ████  FIELD_TYPE_NUMBER  ►  UI_TYPE_STRING  ████
   * ████████████████████████████████████████████████
   */
  format: value => String(value),

  /*
   * ████████████████████████████████████████████████
   * ████  FIELD_TYPE_NUMBER  ◄  UI_TYPE_STRING  ████
   * ████████████████████████████████████████████████
   */
  parse: value => {
    const optimized = value.trim();

    if (!optimized) {
      return EMPTY_FIELD_VALUE; // Considering whitespaces-only strings to be empty value.
    }

    let n = parseFloat(optimized);

    if (isNaN(optimized) || isNaN(n)) {
      const error = {
        code: ERROR_CODE_PARSING,
        id: ERROR_INVALID_NUMBER,
        message: 'Invalid number'
      };

      throw error;
    }

    return n;
  }
};
