import typeNumber from './numberUiType';
import typeString from './stringUiType';

import {
  CONSTRAINT_MIN,
  CONSTRAINT_MAX,

  EMPTY_FIELD_VALUE,

  ERROR_CODE_VALIDATION,

  ERROR_MIN_DECEEDED,
  ERROR_MAX_EXCEEDED,

  UI_TYPE_NUMBER,
  UI_TYPE_STRING
} from '../../constants';

const throwError = error => { throw error; };

export default {

  isValid: value => value === EMPTY_FIELD_VALUE || typeof value === 'string',

  formatter: {
    [UI_TYPE_NUMBER]: typeNumber.formatter,
    [UI_TYPE_STRING]: typeString.formatter
  },

  parser: {
    [UI_TYPE_NUMBER]: typeNumber.parser,
    [UI_TYPE_STRING]: typeString.parser
  },

  buildValidator: value => ({

    /*
     * Specifies the minimum length allowed.
     * param is a number.
     */
    [CONSTRAINT_MIN]: param => value.length >= param || throwError({
      code: ERROR_CODE_VALIDATION,
      id: ERROR_MIN_DECEEDED,
      message: `Min length ${param} is deceeded`
    }),

    /*
     * Specifies the maximum length allowed.
     * param is a number.
     */
    [CONSTRAINT_MAX]: param => value.length <= param || throwError({
      code: ERROR_CODE_VALIDATION,
      id: ERROR_MAX_EXCEEDED,
      message: `Max length ${param} is exceeded`
    })
  })
};
