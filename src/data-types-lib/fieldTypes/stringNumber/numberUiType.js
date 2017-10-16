import Big from 'big.js';

import {
  ERROR_CODE_FORMATING,
  ERROR_FORMAT,
  UI_TYPE_NUMBER,
} from '../../constants';

export default {

  /*
   * █████████████████████████████████████████████████████
   * ████ FIELD_TYPE_STRING_NUMBER --> UI_TYPE_NUMBER ████
   * █████████████████████████████████████████████████████
   *
   * UI_TYPE_NUMBER has empty value => value !== EMPTY_FIELD_VALUE
   */
  formatter: origValue => {
    const value = new Big(origValue);
    const n = Number(value);

    if (!value.eq(n)) {
      // ex. value is larger than Number.MAX_SAFE_INTEGER
      const error = {
        code: ERROR_CODE_FORMATING,
        id: ERROR_FORMAT,
        message: `Unable to convert to "${UI_TYPE_NUMBER}" Component API Type`,
      };

      throw error;
    }

    return n;
  },

  /*
   * █████████████████████████████████████████████████████
   * ████ UI_TYPE_NUMBER --> FIELD_TYPE_STRING_NUMBER ████
   * █████████████████████████████████████████████████████
   */
  parser: value => new Big(value).toString()
};
