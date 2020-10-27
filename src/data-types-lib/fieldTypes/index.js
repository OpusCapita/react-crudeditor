import booleanType from './boolean';
import stringType from './string';
import stringDateType from './stringDate';
import stringDateOnlyType from './stringDateOnly';
import stringDecimalType from './stringDecimal';
import stringIntegerType from './stringInteger';
import integerType from './integer';
import decimalType from './decimal';

import decimalRangeType from './decimalRange';
import integerRangeType from './integerRange';
import stringDateRangeType from './stringDateRange';
import stringDecimalRangeType from './stringDecimalRange';
import stringIntegerRangeType from './stringIntegerRange';

import {
  FIELD_TYPE_BOOLEAN,
  FIELD_TYPE_STRING,
  FIELD_TYPE_STRING_DATE,
  FIELD_TYPE_STRING_DATE_ONLY,
  FIELD_TYPE_STRING_DECIMAL,
  FIELD_TYPE_STRING_INTEGER,
  FIELD_TYPE_INTEGER,
  FIELD_TYPE_DECIMAL,

  FIELD_TYPE_STRING_DATE_RANGE,
  FIELD_TYPE_INTEGER_RANGE,
  FIELD_TYPE_DECIMAL_RANGE,
  FIELD_TYPE_STRING_INTEGER_RANGE,
  FIELD_TYPE_STRING_DECIMAL_RANGE
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
  [FIELD_TYPE_BOOLEAN]: booleanType,
  [FIELD_TYPE_STRING]: stringType,
  [FIELD_TYPE_STRING_DATE]: stringDateType,
  [FIELD_TYPE_STRING_DATE_ONLY]: stringDateOnlyType,
  [FIELD_TYPE_STRING_DECIMAL]: stringDecimalType,
  [FIELD_TYPE_STRING_INTEGER]: stringIntegerType,
  [FIELD_TYPE_INTEGER]: integerType,
  [FIELD_TYPE_DECIMAL]: decimalType,

  [FIELD_TYPE_STRING_DATE_RANGE]: stringDateRangeType,
  [FIELD_TYPE_INTEGER_RANGE]: integerRangeType,
  [FIELD_TYPE_DECIMAL_RANGE]: decimalRangeType,
  [FIELD_TYPE_STRING_INTEGER_RANGE]: stringIntegerRangeType,
  [FIELD_TYPE_STRING_DECIMAL_RANGE]: stringDecimalRangeType
};
