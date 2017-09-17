import Big from 'big.js';

import {
  EMPTY_FIELD_VALUE,
  ERROR_INVALID_NUMBER
} from '../../constants';

export default {

  /*
   * █████████████████████████████████████████████████████████
   * ████ FIELD_TYPE_NUMBER --> COMPONENT_API_TYPE_STRING ████
   * █████████████████████████████████████████████████████████
   *
   * COMPONENT_API_TYPE_STRING has no empty value => value may be EMPTY_FIELD_VALUE
   */
  formatter: value => value === EMPTY_FIELD_VALUE ? '' : new Big(value).toString(),

  /*
   * █████████████████████████████████████████████████████████
   * ████ COMPONENT_API_TYPE_STRING --> FIELD_TYPE_NUMBER ████
   * █████████████████████████████████████████████████████████
   */
  parser: value => {
    const optimized = value.trim();

    if (!optimized) {
      return EMPTY_FIELD_VALUE;  // Considering whitespaces-only strings to be empty value.
    }

    try {
      return new Big(optimized).toString();
    } catch(err) {
      throw {
        id: ERROR_INVALID_NUMBER,
        description: 'Invalid number'
      };
    }
  }
};
