import {
  ERROR_CODE_PARSING,
  EMPTY_FIELD_VALUE,
  ERROR_INVALID_BOOLEAN
} from '../../constants';

export default {

  /*
   * █████████████████████████████████████████████████
   * ████  FIELD_TYPE_BOOLEAN  ►  UI_TYPE_STRING  ████
   * █████████████████████████████████████████████████
   */
  format: value => value ? '+' : '-',

  /*
   * █████████████████████████████████████████████████
   * ████  FIELD_TYPE_BOOLEAN  ◄  UI_TYPE_STRING  ████
   * █████████████████████████████████████████████████
   */
  parse: value => {
    const optimized = value.trim().toLowerCase();

    if (!optimized) {
      return EMPTY_FIELD_VALUE; // Considering whitespaces-only strings to be empty value.
    }

    if (['-', 'no', 'false', 'off'].indexOf(optimized) !== -1) {
      return false;
    }

    if (['+', 'yes', 'true', 'on', 'ok'].indexOf(optimized) !== -1) {
      return true;
    }

    const error = {
      code: ERROR_CODE_PARSING,
      id: ERROR_INVALID_BOOLEAN,
      message: 'Unable to parse string as boolean value'
    };

    throw error;
  }
};
