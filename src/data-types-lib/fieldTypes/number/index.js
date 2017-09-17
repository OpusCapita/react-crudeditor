import Big from 'big.js';

import typeNumber from './numberComponentApiType';
import typeString from './stringComponentApiType';

import {
  CONSTRAINT_INTEGER,
  CONSTRAINT_MIN,
  CONSTRAINT_MAX,

  EMPTY_FIELD_VALUE,

  ERROR_FORBIDDEN_FRACTIONAL_PART,
  ERROR_MIN_DECEEDED,
  ERROR_MAX_EXCEEDED,

  COMPONENT_API_TYPE_NUMBER,
  COMPONENT_API_TYPE_STRING
} from '../../constants';

const throwErr = err => { throw err; };

export default {

  isValid(value) {
    if (value === EMPTY_FIELD_VALUE) {
      return true;
    }

    if (typeof value !== 'string') {
      return false;
    }

    try {
      new Big(value);
      return true;
    } catch(err) {
      return false;
    }
  },

  formatter: {
    [COMPONENT_API_TYPE_NUMBER]: typeNumber.formatter,
    [COMPONENT_API_TYPE_STRING]: typeString.formatter
  },


  parser: {
    [COMPONENT_API_TYPE_NUMBER]: typeNumber.parser,
    [COMPONENT_API_TYPE_STRING]: typeString.parser
  },


  buildValidator(value) {
    value = new Big(value);

    return {

      /*
       * Requires value to be an integer (no floating point).
       * param is boolean.
       */
      [CONSTRAINT_INTEGER]: param => !param || value.eq(value.round()) || throwErr({
        id: ERROR_FORBIDDEN_FRACTIONAL_PART,
        description: 'Fractional part is forbidden'
      }),

      /*
       * Specifies the minimum value allowed.
       * param is number|string|Big.
       */
      [CONSTRAINT_MIN]: param => value.gte(param) || throwErr({
        id: ERROR_MIN_DECEEDED,
        description: `Min ${param} is deceeded`
      }),

      /*
       * Specifies the maximum value allowed.
       * param is number|string|Big.
       */
      [CONSTRAINT_MAX]: param => value.lte(param) || throwErr({
        id: ERROR_MAX_EXCEEDED,
        description: `Max ${param} is exceeded`
      })
    };
  }
};
