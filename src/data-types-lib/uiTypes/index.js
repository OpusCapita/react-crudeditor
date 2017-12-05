import booleanType from './boolean';
import dateType from './date';
import decimalType from './decimal';
import integerType from './integer';
import stringType from './string';

import dateRangeObjectType from './dateRangeObject';
import integerRangeObjectType from './integerRangeObject';
import decimalRangeObjecType from './decimalRangeObject';
import stringRangeObjectType from './stringRangeObject';

import {
  UI_TYPE_BOOLEAN,
  UI_TYPE_DATE,
  UI_TYPE_DECIMAL,
  UI_TYPE_INTEGER,
  UI_TYPE_STRING,

  UI_TYPE_DATE_RANGE_OBJECT,
  UI_TYPE_INTEGER_RANGE_OBJECT,
  UI_TYPE_DECIMAL_RANGE_OBJECT,
  UI_TYPE_STRING_RANGE_OBJECT
} from '../constants';

/*
 * Values are objects with the following methods:
 *
 * isValid(value)
 * Return boolean whether input value is indeed of specified UI Type.
 *
 * EMPTY_VALUE constant getter.
 */
export default {
  [UI_TYPE_BOOLEAN]: booleanType,
  [UI_TYPE_DATE]: dateType,
  [UI_TYPE_DECIMAL]: decimalType,
  [UI_TYPE_INTEGER]: integerType,
  [UI_TYPE_STRING]: stringType,

  [UI_TYPE_DATE_RANGE_OBJECT]: dateRangeObjectType,
  [UI_TYPE_INTEGER_RANGE_OBJECT]: integerRangeObjectType,
  [UI_TYPE_DECIMAL_RANGE_OBJECT]: decimalRangeObjecType,
  [UI_TYPE_STRING_RANGE_OBJECT]: stringRangeObjectType
};
