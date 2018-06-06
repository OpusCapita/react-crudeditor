import Big from 'big.js';

import {
  ERROR_CODE_PARSING,
  EMPTY_FIELD_VALUE,
  ERROR_INVALID_INTEGER
} from '../../constants';

export default {

  /*
   * ████████████████████████████████████████████████████████
   * ████  FIELD_TYPE_STRING_INTEGER  ►  UI_TYPE_STRING  ████
   * ████████████████████████████████████████████████████████
   */
  format: value => new Big(value).toString(),

  /*
   * ████████████████████████████████████████████████████████
   * ████  FIELD_TYPE_STRING_INTEGER  ◄  UI_TYPE_STRING  ████
   * ████████████████████████████████████████████████████████
   */
  parse: value => {
    const optimized = value.trim();

    if (!optimized) {
      return EMPTY_FIELD_VALUE; // Considering whitespaces-only strings to be empty value.
    }

    let big;

    try {
      big = new Big(optimized);
    } catch (_) {
      const error = {
        code: ERROR_CODE_PARSING,
        id: ERROR_INVALID_INTEGER,
        message: 'Invalid integer number'
      };

      throw error;
    }

    if (!big.eq(big.round())) {
      const error = {
        code: ERROR_CODE_PARSING,
        id: ERROR_INVALID_INTEGER,
        message: 'Invalid integer number'
      };

      throw error;
    }

    return big.toString();
  }
};
