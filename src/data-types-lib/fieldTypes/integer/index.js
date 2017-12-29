import integerUiType from './integerUiType';
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
  UI_TYPE_STRING
} from '../../constants';

export default {

  isValid: value =>
    value === EMPTY_FIELD_VALUE ||
    typeof value === 'number' && !isNaN(value) && value === Math.floor(value),

  converter: {
    [UI_TYPE_INTEGER]: integerUiType,
    [UI_TYPE_STRING]: stringUiType
  },

  buildValidator: value => ({

    /*
     * Specifies the minimum number allowed.
     * param is a number.
     */
    [CONSTRAINT_MIN]: param => value >= param || throwError({
      code: ERROR_CODE_VALIDATION,
      id: ERROR_MIN_DECEEDED,
      message: param
    }),

    /*
     * Specifies the maximum number allowed.
     * param is a number.
     */
    [CONSTRAINT_MAX]: param => value <= param || throwError({
      code: ERROR_CODE_VALIDATION,
      id: ERROR_MAX_EXCEEDED,
      message: param
    })
  })
};
