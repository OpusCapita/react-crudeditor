import Big from 'big.js';

import decimalUiType from './decimalUiType';
import stringUiType from './stringUiType';
import { throwError } from '../lib';
import {
  CONSTRAINT_MIN,
  CONSTRAINT_MAX,

  EMPTY_FIELD_VALUE,

  ERROR_CODE_VALIDATION,

  ERROR_MIN_DECEEDED,
  ERROR_MAX_EXCEEDED,

  UI_TYPE_DECIMAL,
  UI_TYPE_STRING
} from '../../constants';

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

  converter: {
    [UI_TYPE_DECIMAL]: decimalUiType,
    [UI_TYPE_STRING]: stringUiType
  },


  buildValidator(origValue) {
    const value = new Big(origValue);

    return {

      /*
       * Specifies the minimum value allowed.
       * param is number|string|Big.
       */
      [CONSTRAINT_MIN]: param => value.gte(param) || throwError({
        code: ERROR_CODE_VALIDATION,
        id: ERROR_MIN_DECEEDED,
        // message: `Min ${param} is deceeded`
        message: param
      }),

      /*
       * Specifies the maximum value allowed.
       * param is number|string|Big.
       */
      [CONSTRAINT_MAX]: param => value.lte(param) || throwError({
        code: ERROR_CODE_VALIDATION,
        id: ERROR_MAX_EXCEEDED,
        // message: `Max ${param} is exceeded`
        message: param
      })
    };
  }
};
