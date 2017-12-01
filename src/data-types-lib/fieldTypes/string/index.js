import numberUiType from './numberUiType';
import stringUiType from './stringUiType';

import {
  CONSTRAINT_MIN,
  CONSTRAINT_MAX,

  ERROR_CODE_VALIDATION,

  ERROR_MIN_DECEEDED,
  ERROR_MAX_EXCEEDED,

  UI_TYPE_NUMBER,
  UI_TYPE_STRING
} from '../../constants';

const throwError = error => { throw error; };

export default {

  converter = {
    [UI_TYPE_NUMBER]: numberUiType,
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
