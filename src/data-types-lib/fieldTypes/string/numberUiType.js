import {
  ERROR_CODE_FORMATING,
  ERROR_INVALID_NUMBER
} from '../../constants';

export default {

  /*
   * ████████████████████████████████████████████████
   * ████  FIELD_TYPE_STRING  ►  UI_TYPE_NUMBER  ████
   * ████████████████████████████████████████████████
   */
  format: value => {
    const n = Number(value);

    if (n !== parseFloat(value)) {
      const error = {
        code: ERROR_CODE_FORMATING,
        id: ERROR_INVALID_NUMBER,
        message: 'Invalid number'
      };

      throw error;
    }

    return n;
  },

  /*
   * ████████████████████████████████████████████████
   * ████  FIELD_TYPE_STRING  ◄  UI_TYPE_NUMBER  ████
   * ████████████████████████████████████████████████
   */
  parse: value => value.toString()
};
