export default {

  /*
   * █████████████████████████████████████████████████
   * ████ FIELD_TYPE_STRING_DATE --> UI_TYPE_DATE ████
   * █████████████████████████████████████████████████
   *
   * UI_TYPE_DATE has empty value => value !== EMPTY_FIELD_VALUE
   */
  formatter: value => new Date(value),

  /*
   * █████████████████████████████████████████████████
   * ████ UI_TYPE_DATE --> FIELD_TYPE_STRING_DATE ████
   * █████████████████████████████████████████████████
   */
  parser: value => value.toString()
};
