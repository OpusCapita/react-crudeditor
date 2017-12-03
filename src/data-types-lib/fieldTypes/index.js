import stringType from './string';
import stringDateType from './stringDate';
import stringNumberType from './stringNumber';
import numberType from './number';

import {
  FIELD_TYPE_STRING,
  FIELD_TYPE_STRING_DATE,
  FIELD_TYPE_STRING_NUMBER,
  FIELD_TYPE_NUMBER
} from '../constants';

/*
 * Values are objects with the following properties:
 *
 * isValid(value)
 * Method returning boolean whether input value is indeed of specified Field Type.
 *
 * converter
 * An object with UI Types as keys and { format, parse } as values.
 * Each formatter accepts valid non-EMPTY_FIELD_VALUE value of specified Field Type
 * and converts it to the specified UI Type
 * or throws an error when unable to convert.
 * Each parser accepts a valid, natively non-EMPTY_VALUE of specified UI Type
 * and parses it to the specified Field Type
 * or throws an error when unable to convert.
 *
 * buildValidator(value)
 * Method returning input value validator.
 * Each validator is an object with constraint names as keys
 * and function validating input value against corresponding constraint as values.
 * The function arguments are params of the constraint,
 * it returns boolean true (in case of value passing the validator)
 * or throws error object otherwise.
 */
export default {
  [FIELD_TYPE_STRING]: stringType,
  [FIELD_TYPE_STRING_DATE]: stringDateType,
  [FIELD_TYPE_STRING_NUMBER]: stringNumberType,
  [FIELD_TYPE_NUMBER]: numberType
};
