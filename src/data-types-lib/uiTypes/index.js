import booleanType from './boolean';
import dateType from './date';
import numberType from './number';
import stringType from './string';

import {
  UI_TYPE_BOOLEAN,
  UI_TYPE_DATE,
  UI_TYPE_NUMBER,
  UI_TYPE_STRING,
} from '../constants';

/*
 * Values are objects with the following methods:
 *
 * isEmpty(value)
 * Returns boolean
 * -- true if UI Type has native EMPTY_VALUE and input value is equal to it,
 * -- false otherwise.
 * XXX: individual Field Type parsers may consider more values to be empty.
 *
 * isValid(value)
 * Return boolean whether input value is indeed of specified UI Type.
 *
 * EMPTY_VALUE constant getter.
 */
export default {
  [UI_TYPE_BOOLEAN]: booleanType,
  [UI_TYPE_DATE]: dateType,
  [UI_TYPE_NUMBER]: numberType,
  [UI_TYPE_STRING]: stringType
};
