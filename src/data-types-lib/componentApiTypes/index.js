import booleanType from './boolean';
import numberType from './number';
import stringType from './string';

import {
  COMPONENT_API_TYPE_BOOLEAN,
  COMPONENT_API_TYPE_NUMBER,
  COMPONENT_API_TYPE_STRING,
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
  [COMPONENT_API_TYPE_BOOLEAN]: booleanType,
  [COMPONENT_API_TYPE_NUMBER]: numberType,
  [COMPONENT_API_TYPE_STRING]: stringType
};
