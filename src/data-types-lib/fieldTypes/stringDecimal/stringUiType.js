import Big from 'big.js';

import {
  ERROR_CODE_PARSING,
  EMPTY_FIELD_VALUE,
  ERROR_INVALID_DECIMAL
} from '../../constants';

export default {

  /*
   * ████████████████████████████████████████████████████████
   * ████  FIELD_TYPE_DECIMAL  ►  UI_TYPE_STRING  ████
   * ████████████████████████████████████████████████████████
   */
  format: value => new Big(value).toString(),

  /*
   * ████████████████████████████████████████████████████████
   * ████  FIELD_TYPE_DECIMAL  ◄  UI_TYPE_STRING  ████
   * ████████████████████████████████████████████████████████
   */
  parse: value => {
    const optimized = value.trim();

    if (!optimized) {
      return EMPTY_FIELD_VALUE; // Considering whitespaces-only strings to be empty value.
    }

    try {
      return new Big(optimized).toString();
    } catch (e) {
      const error = {
        code: ERROR_CODE_PARSING,
        id: ERROR_INVALID_DECIMAL,
        message: 'Invalid decimal number'
      };

      throw error;
    }
  }
};
