import {
  ERROR_CODE_FORMATING,
  ERROR_INVALID_DECIMAL
} from '../../constants';

export default {

  /*
   * █████████████████████████████████████████████████
   * ████  FIELD_TYPE_STRING  ►  UI_TYPE_DECIMAL  ████
   * █████████████████████████████████████████████████
   */
  format: value => {
    const n = Number(value);

    if (n !== parseFloat(value)) {
      const error = {
        code: ERROR_CODE_FORMATING,
        id: ERROR_INVALID_DECIMAL,
        message: 'Invalid decimal number'
      };

      throw error;
    }

    return n;
  },

  /*
   * █████████████████████████████████████████████████
   * ████  FIELD_TYPE_STRING  ◄  UI_TYPE_DECIMAL  ████
   * █████████████████████████████████████████████████
   */
  parse: value => value.toString()
};
