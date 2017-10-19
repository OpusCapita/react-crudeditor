export default {

  /*
   * ██████████████████████████████████████████████
   * ████ FIELD_TYPE_NUMBER --> UI_TYPE_NUMBER ████
   * ██████████████████████████████████████████████
   *
   * UI_TYPE_NUMBER has empty value => value !== EMPTY_FIELD_VALUE
   */
  formatter: value => value,

  /*
   * ██████████████████████████████████████████████
   * ████ UI_TYPE_NUMBER --> FIELD_TYPE_NUMBER ████
   * ██████████████████████████████████████████████
   */
  parser: value => value
};
