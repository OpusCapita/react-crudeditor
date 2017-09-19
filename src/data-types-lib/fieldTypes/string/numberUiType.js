import {
  ERROR_CODE_FORMATING,
  ERROR_INVALID_NUMBER
} from '../../constants';

export default {

  /*
   * ██████████████████████████████████████████████
   * ████ FIELD_TYPE_STRING --> UI_TYPE_NUMBER ████
   * ██████████████████████████████████████████████
   *
   * UI_TYPE_NUMBER has empty value => value !== EMPTY_FIELD_VALUE
   */
  formatter: value => {
    const n = Number(value);

    if (n !== parseFloat(value)) {
      throw {
        code: ERROR_CODE_FORMATING,
        id: ERROR_INVALID_NUMBER,
        message: 'Invalid number'
      };
    }

    return n;
  },

  /*
   * ██████████████████████████████████████████████
   * ████ UI_TYPE_NUMBER --> FIELD_TYPE_STRING ████
   * ██████████████████████████████████████████████
   */
  parser: value => value.toString()
};
