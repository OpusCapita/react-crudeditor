import Big from 'big.js';

import {
  ERROR_CODE_FORMATING,
  ERROR_FORMAT,
  UI_TYPE_DECIMAL,
} from '../../constants';

export default {

  /*
   * █████████████████████████████████████████████████████████
   * ████  FIELD_TYPE_STRING_DECIMAL  ►  UI_TYPE_DECIMAL  ████
   * █████████████████████████████████████████████████████████
   */
  format: ({ value: origValue }) => {
    const value = new Big(origValue);
    const n = Number(value);

    if (!value.eq(n)) {
      // ex. value is larger than Number.MAX_SAFE_INTEGER
      const error = {
        code: ERROR_CODE_FORMATING,
        id: ERROR_FORMAT,
        message: `Unable to convert to "${UI_TYPE_DECIMAL}" UI Type`,
      };

      throw error;
    }

    return n;
  },

  /*
   * █████████████████████████████████████████████████████████
   * ████  FIELD_TYPE_STRING_DECIMAL  ◄  UI_TYPE_DECIMAL  ████
   * █████████████████████████████████████████████████████████
   */
  parse: ({ value }) => new Big(value).toString()
};
