import Big from 'big.js';

const
  CONSTRAINT_INTEGER = 'integer',
  CONSTRAINT_MIN = 'min',
  CONSTRAINT_MAX = 'max',

  ERROR_FORBIDDEN_FRACTIONAL_PART = 'forbiddenFractionalPartError',
  ERROR_FORMAT = 'formatError',
  ERROR_INVALID_NUMBER = 'invalidNumberError',
  ERROR_MIN_DECEEDED = 'minDeceededError',
  ERROR_MAX_EXCEEDED = 'maxExceededError',
  ERROR_UNKNOWN_CONSTRAINT = 'unknownConstraintError',
  ERROR_UNKNOWN_SOURCE_TYPE = 'unknownSourceTypeError',
  ERROR_UNKNOWN_TARGET_TYPE = 'unknownTargetTypeError',

  TYPE_NUMBER = 'number',
  TYPE_STRING = 'string';

// ███████████████████████████████████████████████████████████████████████████████████████████████████████████

/*
 * Each formatter accepts Big instance
 * and converts it to the same type as method name
 * or throws an error when unable to convert.
 */
const formatters = {
  [TYPE_NUMBER]: value => {
    const n = Number(value);

    if (!value.eq(n)) {
      // ex. value is larger than Number.MAX_SAFE_INTEGER
      throw {
        id: ERROR_FORMAT,
        description: `Unable to convert to "${TYPE_NUMBER}" type`,
      }
    }

    return Number(value);
  },

  [TYPE_STRING]: value => value.toString()
};

// ███████████████████████████████████████████████████████████████████████████████████████████████████████████

/*
 * Each parser accepts a value of the same type as method name
 * and converts it to a string
 * or throws an error when unable to convert.
 */
const parsers = {
  [TYPE_NUMBER]: value => new Big(value).toString(),
  [TYPE_STRING]: value => new Big(value.trim()).toString()
}

// ███████████████████████████████████████████████████████████████████████████████████████████████████████████

/*
 * Each validator is applied to value which is Big instance
 * and returns falsy value (in case of value passing the validator)
 * or error object otherwise.
 */
const buildValidators = value => ({

  /*
   * Requires value to be an integer (no floating point).
   * param is boolean.
   */
  [CONSTRAINT_INTEGER]: param => param === true && !value.eq(value.round()) && {
    id: ERROR_FORBIDDEN_FRACTIONAL_PART,
    description: 'Fractional part is forbidden'
  },

  /*
   * Specifies the minimum value allowed.
   * param is number|string|Big.
   */
  [CONSTRAINT_MIN]: param => value.lt(param) && {
    id: ERROR_MIN_DECEEDED,
    description: `Min ${param} is deceeded`
  },

  /*
   * Specifies the maximum value allowed.
   * param is number|string|Big.
   */
  [CONSTRAINT_MAX]: param => value.gt(param) && {
    id: ERROR_MAX_EXCEEDED,
    description: `Max ${param} is exceeded`
  }
});

export const

  // ███████████████████████████████████████████████████████████████████████████████████████████████████████████

  /*
   * Input value is of type "string".
   * Output is value converted to type targetType.
   * An error is thrown in case of conversion failure.
   */
  format = ({ value, targetType }) => {
    if (typeof value !== 'string') {
      throw {
        id: ERROR_FORMAT,
        description: 'format() function works with strings only',
      }
    }

    if (!formatters.hasOwnProperty(targetType)) {
      throw {
        id: ERROR_UNKNOWN_TARGET_TYPE,
        description: `Unable to format to unknown Target Type "${sourceType}"`
      };
    }

    // value is expected to be valid => throwing uncatched NaN on an invalid value:
    return formatters[targetType](new Big(value));
  },

  // ███████████████████████████████████████████████████████████████████████████████████████████████████████████

  /*
   * Input value is of type sourceType.
   * Output is value converted to type "string".
   * An error is thrown in case of conversion failure.
   */
  parse = ({ value, sourceType }) => {
    if (!parsers.hasOwnProperty(sourceType)) {
      throw {
        id: ERROR_UNKNOWN_SOURCE_TYPE,
        description: `Unable to parse unknown Source Type "${sourceType}"`
      };
    }

    try {
      return parsers[sourceType](value);
    } catch(e) {
      throw {
        id: ERROR_INVALID_NUMBER,
        description: 'Invalid number'
      };
    }
  },

  // ███████████████████████████████████████████████████████████████████████████████████████████████████████████

  /*
   * Input value is a string (output of parse-function).
   * Output is true in case of successful validation
   * An array of errors is thrown in case of validation failure.
   */
  validate = ({ value, constraints }) => {
    // value is expected to be valid => throwing uncatched NaN on an invalid value:
    const validators = buildValidators(new Big(value));

    const errors = Object.keys(constraints).reduce(
      (errors, name) => {
        if (!validators.hasOwnProperty(name)) {
          return [{
            id: ERROR_UNKNOWN_CONSTRAINT,
            description: `Unable to validate against unknown constraint "${name}"`
          }, ...errors];
        }

        const err = validators[name](constraints[name]);
        return err ? [...errors, err] : errors;
      },
      []
    );

    if (errors.length) {
      throw errors;
    }

    return true;
  };
