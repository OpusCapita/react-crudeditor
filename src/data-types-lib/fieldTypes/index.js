import numberStringType from './numberString';
import stringType from './string';

import {
  FIELD_TYPE_NUMBER_STRING,
  FIELD_TYPE_STRING,
} from '../constants';

/*
 * Values are objects with the following properties:
 *
 * isValid(value)
 * Method returning boolean whether input value is indeed of specified Field Type.
 *
 * formatter
 * An object with Component API Types as keys and formatters to the corresponding Component API Types as values.
 * Each formatter accepts valid value of specified Field Type
 * (may be empty in case of no native empty value in the specified Component API Type)
 * and converts it to the specified Component API Type
 * or throws an error when unable to convert.
 *
 * parser
 * An object with Component API Types as keys and parsers to the corresponding Component API Types as values.
 * Each parser accepts a valid, natively non-empty value of specified Component API Type
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
  [FIELD_TYPE_NUMBER_STRING]: numberStringType,
  [FIELD_TYPE_STRING]: stringType
};
