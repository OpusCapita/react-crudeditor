import {
  ERROR_CODE_PARSING,
  EMPTY_FIELD_VALUE,
  ERROR_INVALID_DATE
} from '../../constants';

export default {

  /*
   * ███████████████████████████████████████████████████
   * ████ FIELD_TYPE_STRING_DATE --> UI_TYPE_STRING ████
   * ███████████████████████████████████████████████████
   *
   * UI_TYPE_STRING has no empty value => value may be EMPTY_FIELD_VALUE
   */
  formatter: value => value === EMPTY_FIELD_VALUE ? '' : new Date(value).toString(),

  /*
   * ███████████████████████████████████████████████████
   * ████ UI_TYPE_STRING --> FIELD_TYPE_STRING_DATE ████
   * ███████████████████████████████████████████████████
   */
  parser: value => {
    const optimized = value.trim();

    if (!optimized) {
      return EMPTY_FIELD_VALUE; // Considering whitespaces-only strings to be empty value.
    }

    if ((new Date(value) === "Invalid Date") || isNaN(new Date(value))) {
      const error = {
        code: ERROR_CODE_PARSING,
        id: ERROR_INVALID_DATE,
        message: 'Invalid date'
      };

      throw error;
    }

    return new Date(optimized).toString();
  }
};
