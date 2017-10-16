export const

  EMPTY_FIELD_VALUE = null,

  /* ███████████████████████████████████████████*\
   *███ FIELD TYPES (in alphabetical order) ███*
  \*███████████████████████████████████████████*/

  FIELD_TYPE_BOOLEAN = 'boolean', // JavaScript type "boolean".
  FIELD_TYPE_STRING_DATE = 'stringDate', // JavaScript type "string" with date.

  /*
   * JavaScript type "string" with decimal number of any size,
   * i.e. rational number written in Base 10 and having finite number of digits after decimal point.
   * It may be in exponential, as well as normal (non-exponential) notation.
   */
  FIELD_TYPE_STRING_NUMBER = 'stringNumber',

  FIELD_TYPE_STRING = 'string', // JavaScript type "string".

  /* ███████████████████████████████████████████*\
   *███  UI TYPES (in alphabetical order)   ███*
  \*███████████████████████████████████████████*/

  UI_TYPE_BOOLEAN = 'boolean', // JavaScript type "boolean".
  UI_TYPE_NUMBER = 'number', // JavaScript type "number".
  UI_TYPE_STRING = 'string', // JavaScript type "string".

  /* ███████████████████████████████████████████*\
   *███ CONSTRAINTS (in alphabetical order) ███*
  \*███████████████████████████████████████████*/

  CONSTRAINT_INTEGER = 'integer',
  CONSTRAINT_MIN = 'min',
  CONSTRAINT_MAX = 'max',

  /* ███████████████████████████████████████████*\
   *███ ERROR CODES (in alphabetical order) ███*
  \*███████████████████████████████████████████*/

  ERROR_CODE_FORMATING = 400,
  ERROR_CODE_PARSING = 400,
  ERROR_CODE_VALIDATION = 400,

  /* ███████████████████████████████████████████*\
   *███  ERROR IDS (in alphabetical order)  ███*
  \*███████████████████████████████████████████*/

  ERROR_FORBIDDEN_FRACTIONAL_PART = 'forbiddenFractionalPartError',
  ERROR_FORMAT = 'formatError',
  ERROR_INVALID_FIELD_TYPE_VALUE = 'invalidFieldTypeValue',
  ERROR_INVALID_UI_TYPE_VALUE = 'invalidUiTypeValue',
  ERROR_INVALID_NUMBER = 'invalidNumberError',
  ERROR_MIN_DECEEDED = 'minDeceededError',
  ERROR_MAX_EXCEEDED = 'maxExceededError',
  ERROR_REQUIRED_MISSING = 'requiredMissingError',
  ERROR_UNKNOWN_UI_TYPE = 'unknownUiTypeError',
  ERROR_UNKNOWN_CONSTRAINT = 'unknownConstraintError',
  ERROR_UNKNOWN_FIELD_TYPE = 'unknownFieldTypeError';
