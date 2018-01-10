import integerUiType from './integerUiType';
import decimalUiType from './decimalUiType';
import stringUiType from './stringUiType';
import { throwError } from '../lib';
import {
  CONSTRAINT_MIN,
  CONSTRAINT_MAX,

  CONSTRAINT_EMAIL,
  CONSTRAINT_MATCHES,
  CONSTRAINT_URL,

  EMPTY_FIELD_VALUE,

  ERROR_CODE_VALIDATION,

  ERROR_MIN_DECEEDED,
  ERROR_MAX_EXCEEDED,

  ERROR_INVALID_EMAIL,
  ERROR_INVALID_URL,
  ERROR_REGEX_DOESNT_MATCH,

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
      args: {
        payload: param
      }
    }),

    /*
     * Specifies the maximum length allowed.
     * param is a number.
     */
    [CONSTRAINT_MAX]: param => value.length <= param || throwError({
      code: ERROR_CODE_VALIDATION,
      id: ERROR_MAX_EXCEEDED,
      args: {
        payload: param
      }
    }),

    [CONSTRAINT_EMAIL]: param => param && (
      // eslint-disable-next-line max-len
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.
        test(value) || throwError({
        code: ERROR_CODE_VALIDATION,
        id: ERROR_INVALID_EMAIL
      })
    ),

    [CONSTRAINT_URL]: param => param && (
      // eslint-disable-next-line max-len
      /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i.
        test(value) || throwError({
        code: ERROR_CODE_VALIDATION,
        id: ERROR_INVALID_URL
      })
    ),

    [CONSTRAINT_MATCHES]: param => param.test(value) || throwError({
      code: ERROR_CODE_VALIDATION,
      id: ERROR_REGEX_DOESNT_MATCH,
      args: {
        payload: param.toString()
      }
    })
  })
};
