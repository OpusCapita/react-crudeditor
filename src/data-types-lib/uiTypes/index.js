import booleanType from './boolean';
import numberType from './number';
import stringType from './string';

import {
  UI_TYPE_BOOLEAN,
  UI_TYPE_NUMBER,
  UI_TYPE_STRING,
} from '../constants';

/*
 * Values are objects with the following methods:
 *
 * getEmpty()
 * Returns Component API Type's native empty value (DB NULL equivalent)
 * or throws an error if no such value exists.
 * XXX: individual Field Type parsers may consider more values to be empty.
 *
 * isValid(value)
 * Return boolean whether input value is indeed of specified Component API Type.
 */
export default {
  [UI_TYPE_BOOLEAN]: booleanType,
  [UI_TYPE_NUMBER]: numberType,
  [UI_TYPE_STRING]: stringType
};
