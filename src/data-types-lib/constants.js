export const

  EMPTY_FIELD_VALUE = null,

  /* ███████████████████████████████████████████
   * ███ FIELD TYPES (in alphabetical order) ███
   * ███████████████████████████████████████████
   */

  FIELD_TYPE_BOOLEAN = 'boolean', // JavaScript type "boolean".

  FIELD_TYPE_STRING = 'string', // JavaScript type "string".

  /*
   * JavaScript type "string" with decimal integer number of any size,
   * i.e. rational number written in Base 10 and having no decimal part.
   * It may be in exponential, as well as normal (non-exponential) notation.
   */
  FIELD_TYPE_INTEGER = 'integer',

  /*
   * JavaScript type "string" with decimal number of any size,
   * i.e. rational number written in Base 10 and having finite number of digits after decimal point.
   * It may be in exponential, as well as normal (non-exponential) notation.
   */
  FIELD_TYPE_DECIMAL = 'decimal',

  FIELD_TYPE_STRING_DATE = 'stringDate', // JavaScript type "string" with date.

  // JavaScript object with two properties "from" and "to".
  // Each property value is of FIELD_TYPE_STRING_DATE.
  FIELD_TYPE_STRING_DATE_RANGE = 'stringDateRange',

  // JavaScript object with two properties "from" and "to".
  // Each property value is of FIELD_TYPE_INTEGER.
  FIELD_TYPE_STRING_INTEGER_RANGE = 'stringIntegerRange',

  // JavaScript object with two properties "from" and "to".
  // Each property value is of FIELD_TYPE_DECIMAL.
  FIELD_TYPE_STRING_DECIMAL_RANGE = 'stringDecimalRange',

  /* ███████████████████████████████████████████
   * ███  UI TYPES (in alphabetical order)   ███
   * ███████████████████████████████████████████
   */

  UI_TYPE_BOOLEAN = 'boolean', // JavaScript type "boolean".

  // JavaScript type "number" only with real numbers having a finate sequence
  // of digits to the right of the decimal point.
  // Both fixed and exponential notations are allowed.
  UI_TYPE_DECIMAL = 'decimal',

  UI_TYPE_DATE = 'date', // JavaScript type "object" which is an instance of Date.

  // JavaScript type "number" with integers only,
  // i.e. natual numbers, their counterpart and 0.
  // Both fixed and exponential notations are allowed.
  UI_TYPE_INTEGER = 'integer',

  UI_TYPE_STRING = 'string', // JavaScript type "string".

  // JavaScript object with two properties "from" and "to".
  // Each property value is of UI_TYPE_DATE.
  UI_TYPE_DATE_RANGE_OBJECT = 'dateRangeObject',

  // JavaScript object with two properties "from" and "to".
  // Each property value is of UI_TYPE_INTEGER.
  UI_TYPE_INTEGER_RANGE_OBJECT = 'integerRangeObject',

  // JavaScript object with two properties "from" and "to".
  // Each property value is of UI_TYPE_DECIMAL.
  UI_TYPE_DECIMAL_RANGE_OBJECT = 'decimalRangeObject',

  // JavaScript object with two properties "from" and "to".
  // Each property value is of UI_TYPE_STRING.
  UI_TYPE_STRING_RANGE_OBJECT = 'stringRangeObject',

  /* ███████████████████████████████████████████
   * ███ CONSTRAINTS (in alphabetical order) ███
   * ███████████████████████████████████████████
   */

  CONSTRAINT_MIN = 'min',
  CONSTRAINT_MAX = 'max',

  /* ███████████████████████████████████████████
   * ███ ERROR CODES (in alphabetical order) ███
   * ███████████████████████████████████████████
   */

  ERROR_CODE_FORMATING = 400,
  ERROR_CODE_PARSING = 400,
  ERROR_CODE_VALIDATION = 400,

  /* ███████████████████████████████████████████
   * ███  ERROR IDS (in alphabetical order)  ███
   * ███████████████████████████████████████████
   */

  ERROR_FORMAT = 'formatError',
  ERROR_INVALID_BOOLEAN = 'invalidBooleanValue',
  ERROR_INVALID_DATE = 'invalidDateValue',
  ERROR_INVALID_FIELD_TYPE_VALUE = 'invalidFieldTypeValue',
  ERROR_INVALID_UI_TYPE_VALUE = 'invalidUiTypeValue',
  ERROR_INVALID_INTEGER = 'invalidIntegerError',
  ERROR_INVALID_DECIMAL = 'invalidDecimalError',
  ERROR_MIN_DECEEDED = 'minDeceededError',
  ERROR_MAX_EXCEEDED = 'maxExceededError',
  ERROR_REQUIRED_MISSING = 'requiredMissingError',
  ERROR_UNKNOWN_CONSTRAINT = 'unknownConstraintError';
