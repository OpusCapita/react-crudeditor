import dateUiType from './dateUiType';
import stringUiType from './stringUiType';
import { throwError } from '../lib';
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

  converter: {
    [UI_TYPE_DATE]: dateUiType,
    [UI_TYPE_STRING]: stringUiType
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
        message: param
      }),

      /*
       * Specifies the maximum value allowed.
       * param is string.
       */
      [CONSTRAINT_MAX]: param => value <= new Date(param) || throwError({
        code: ERROR_CODE_VALIDATION,
        id: ERROR_MAX_EXCEEDED,
        message: param
      })
    };
  }
};
