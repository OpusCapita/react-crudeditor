import { isValid as isValidFieldType } from './lib';
import { isValid as isValidUiType } from '../../uiTypes/number';

import {
  EMPTY_VALUE,
  ERROR_CODE_FORMATING,
  ERROR_INVALID_FIELD_TYPE_VALUE,
  ERROR_INVALID_NUMBER,
  ERROR_INVALID_UI_TYPE_VALUE
} from '../../constants';

const throwError = error => { throw error; };

export default {

  /*
   * ██████████████████████████████████████████████
   * ████ FIELD_TYPE_STRING --> UI_TYPE_NUMBER ████
   * ██████████████████████████████████████████████
   */
  format(value) {
    // ■■■ start of common code for every formatter ■■■
    if (!isValidFieldType(value)) {
      throwError({
        code: ERROR_CODE_FORMATING,
        id: ERROR_INVALID_FIELD_TYPE_VALUE,
        message: `Invalid Field Type value "${value}"`
      });
    }

    if (value === EMPTY_VALUE) {
      return value;
    }
    // ■■■ end of common code for every formatter ■■■

    const n = Number(value);

    if (n !== parseFloat(value)) {
      throwError({
        code: ERROR_CODE_FORMATING,
        id: ERROR_INVALID_NUMBER,
        message: 'Invalid number'
      });
    }

    return n;
  },

  /*
   * ██████████████████████████████████████████████
   * ████ UI_TYPE_NUMBER --> FIELD_TYPE_STRING ████
   * ██████████████████████████████████████████████
   */
  parse(value) {
    // ■■■ start of common code for every formatter ■■■
    if (!isValidUiType(value)) {
      throwError({
        code: ERROR_CODE_PARSING,
        id: ERROR_INVALID_UI_TYPE_VALUE,
        message: `Invalid UI Type value "${value}"`
      });
    }

    if (value === EMPTY_VALUE) {
      return value;
    }
    // ■■■ end of common code for every formatter ■■■

    return value.toString();
  }
};
