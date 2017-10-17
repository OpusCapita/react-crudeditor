import Big from 'big.js';

import typeNumber from './numberUiType';
import typeString from './stringUiType';

import {
  CONSTRAINT_INTEGER,
  CONSTRAINT_MIN,
  CONSTRAINT_MAX,

  EMPTY_FIELD_VALUE,

  ERROR_CODE_VALIDATION,

  ERROR_FORBIDDEN_FRACTIONAL_PART,
  ERROR_MIN_DECEEDED,
  ERROR_MAX_EXCEEDED,

  UI_TYPE_NUMBER,
  UI_TYPE_STRING
} from '../../constants';

const throwError = error => { throw error; };

export default {

  isValid(value) {
    if (value === EMPTY_FIELD_VALUE) {
      return true;
    }

    if (typeof value !== 'string') {
      return false;
    }

    try {
      new Big(value); // eslint-disable-line no-new
      return true;
    } catch (error) {
      return false;
    }
  },

  formatter: {
    [UI_TYPE_NUMBER]: typeNumber.formatter,
    [UI_TYPE_STRING]: typeString.formatter
  },


  parser: {
    [UI_TYPE_NUMBER]: typeNumber.parser,
    [UI_TYPE_STRING]: typeString.parser
  },


  buildValidator(origValue) {
    const value = new Big(origValue);

    return {

      /*
       * Requires value to be an integer (no floating point).
       * param is boolean.
       */
      [CONSTRAINT_INTEGER]: param => !param || value.eq(value.round()) || throwError({
        code: ERROR_CODE_VALIDATION,
        id: ERROR_FORBIDDEN_FRACTIONAL_PART,
        message: 'Fractional part is forbidden'
      }),

      /*
       * Specifies the minimum value allowed.
       * param is number|string|Big.
       */
      [CONSTRAINT_MIN]: param => value.gte(param) || throwError({
        code: ERROR_CODE_VALIDATION,
        id: ERROR_MIN_DECEEDED,
        message: `Min ${param} is deceeded`
      }),

      /*
       * Specifies the maximum value allowed.
       * param is number|string|Big.
       */
      [CONSTRAINT_MAX]: param => value.lte(param) || throwError({
        code: ERROR_CODE_VALIDATION,
        id: ERROR_MAX_EXCEEDED,
        message: `Max ${param} is exceeded`
      })
    };
  }
};
