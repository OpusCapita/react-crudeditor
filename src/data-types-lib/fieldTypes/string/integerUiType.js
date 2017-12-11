import {
  ERROR_CODE_FORMATING,
  ERROR_INVALID_INTEGER
} from '../../constants';

export default {

  /*
   * █████████████████████████████████████████████████
   * ████  FIELD_TYPE_STRING  ►  UI_TYPE_INTEGER  ████
   * █████████████████████████████████████████████████
   */
  format: ({ value }) => {
    const n = Number(value);

    if (n !== parseInt(value, 10)) {
      const error = {
        code: ERROR_CODE_FORMATING,
        id: ERROR_INVALID_INTEGER,
        message: 'Invalid integer'
      };

      throw error;
    }

    return n;
  },

  /*
   * █████████████████████████████████████████████████
   * ████  FIELD_TYPE_STRING  ◄  UI_TYPE_INTEGER  ████
   * █████████████████████████████████████████████████
   */
  parse: ({ value }) => value.toString()
};
