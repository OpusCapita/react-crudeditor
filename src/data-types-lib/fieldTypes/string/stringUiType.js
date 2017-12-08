import { EMPTY_FIELD_VALUE } from '../../constants';

export default {

  /*
   * ████████████████████████████████████████████████
   * ████  FIELD_TYPE_STRING  ►  UI_TYPE_STRING  ████
   * ████████████████████████████████████████████████
   */
  format: value => value,

  /*
   * ████████████████████████████████████████████████
   * ████  FIELD_TYPE_STRING  ◄  UI_TYPE_STRING  ████
   * ████████████████████████████████████████████████
   */
  parse: value => value || EMPTY_FIELD_VALUE
};
