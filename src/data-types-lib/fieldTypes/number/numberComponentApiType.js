import Big from 'big.js';

import {
  ERROR_CODE_FORMATING,
  ERROR_FORMAT,
  COMPONENT_API_TYPE_NUMBER,
} from '../../constants';

export default {

  /*
   * █████████████████████████████████████████████████████████
   * ████ FIELD_TYPE_NUMBER --> COMPONENT_API_TYPE_NUMBER ████
   * █████████████████████████████████████████████████████████
   *
   * COMPONENT_API_TYPE_NUMBER has empty value => value !== EMPTY_FIELD_VALUE
   */
  formatter: value => {
    value = new Big(value);
    const n = Number(value);

    if (!value.eq(n)) {
      // ex. value is larger than Number.MAX_SAFE_INTEGER
      throw {
        code: ERROR_CODE_FORMATING,
        id: ERROR_FORMAT,
        message: `Unable to convert to "${COMPONENT_API_TYPE_NUMBER}" Component API Type`,
      }
    }

    return n;
  },

  /*
   * █████████████████████████████████████████████████████████
   * ████ COMPONENT_API_TYPE_NUMBER --> FIELD_TYPE_NUMBER ████
   * █████████████████████████████████████████████████████████
   */
  parser: value => new Big(value).toString()
};
