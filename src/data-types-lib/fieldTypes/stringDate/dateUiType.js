export default {

  /*
   * ███████████████████████████████████████████████████
   * ████  FIELD_TYPE_STRING_DATE  ►  UI_TYPE_DATE  ████
   * ███████████████████████████████████████████████████
   *
   * UI_TYPE_DATE has empty value => value !== EMPTY_FIELD_VALUE
   */
  format: value => new Date(value),

  /*
   * ███████████████████████████████████████████████████
   * ████  FIELD_TYPE_STRING_DATE  ◄  UI_TYPE_DATE  ████
   * ███████████████████████████████████████████████████
   */
  parse: value => value.toISOString()
};
