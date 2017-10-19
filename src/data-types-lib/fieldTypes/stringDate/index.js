import typeDate from './dateUiType';
import typeString from './stringUiType';

import {
  CONSTRAINT_MIN,
  CONSTRAINT_MAX,

  EMPTY_FIELD_VALUE,

  ERROR_CODE_VALIDATION,

  ERROR_MIN_DECEEDED,
  ERROR_MAX_EXCEEDED,

  UI_TYPE_DATE,
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

    return (new Date(value) !== "Invalid Date") && !isNaN(new Date(value));
  },

  formatter: {
    [UI_TYPE_DATE]: typeDate.formatter,
    [UI_TYPE_STRING]: typeString.formatter
  },


  parser: {
    [UI_TYPE_DATE]: typeDate.parser,
    [UI_TYPE_STRING]: typeString.parser
  },


  buildValidator(origValue) {
    const value = new Date(origValue);

    return {

      /*
       * Specifies the minimum value allowed.
       * param is string.
       */
      [CONSTRAINT_MIN]: param => value >= new Date(param) || throwError({
        code: ERROR_CODE_VALIDATION,
        id: ERROR_MIN_DECEEDED,
        message: `Min ${param} is deceeded`
      }),

      /*
       * Specifies the maximum value allowed.
       * param is string.
       */
      [CONSTRAINT_MAX]: param => value <= new Date(param) || throwError({
        code: ERROR_CODE_VALIDATION,
        id: ERROR_MAX_EXCEEDED,
        message: `Max ${param} is exceeded`
      })
    };
  }
};
