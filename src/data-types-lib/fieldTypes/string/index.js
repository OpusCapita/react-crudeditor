import integerUiType from './integerUiType';
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

  UI_TYPE_INTEGER,
  UI_TYPE_DECIMAL,
  UI_TYPE_STRING
} from '../../constants';

export default {

  isValid: value => value === EMPTY_FIELD_VALUE || typeof value === 'string',

  converter: {
    [UI_TYPE_INTEGER]: integerUiType,
    [UI_TYPE_DECIMAL]: decimalUiType,
    [UI_TYPE_STRING]: stringUiType
  },

  buildValidator: value => ({

    /*
     * Specifies the minimum length allowed.
     * param is a number.
     */
    [CONSTRAINT_MIN]: param => value.length >= param || throwError({
      code: ERROR_CODE_VALIDATION,
      id: ERROR_MIN_DECEEDED,
      // message: `Min length ${param} is deceeded`
      message: param
    }),

    /*
     * Specifies the maximum length allowed.
     * param is a number.
     */
    [CONSTRAINT_MAX]: param => value.length <= param || throwError({
      code: ERROR_CODE_VALIDATION,
      id: ERROR_MAX_EXCEEDED,
      // message: `Max length ${param} is exceeded`
      message: param
    })
  })
};
