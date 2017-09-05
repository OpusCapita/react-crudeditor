import Big from 'big.js';

const
  CONSTRAINT_INTEGER = 'integer',
  CONSTRAINT_MIN = 'min',
  CONSTRAINT_MAX = 'max',

  ERROR_FORBIDDEN_FRACTIONAL_PART = 'forbiddenFractionalPartError',
  ERROR_FORMAT = 'formatError',
  ERROR_INVALID_NUMBER = 'invalidNumberError',

  TYPE_NUMBER = 'number',
  TYPE_STRING = 'string';

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

/*
 * Each parser accepts a value of the same type as method name
 * and converts it to a string
 * or throws an error when unable to convert.
 */
const parsers = {
  [TYPE_NUMBER]: value => new Big(value).toString(),
  [TYPE_STRING]: value => new Big(value).toString()
}

/*
 * Rules are applied to target which is Big instance.
 */
const buildValidators = target => ({
  /*
   * Requires the number to be an integer (no floating point).
   * Constraint value is boolean.
   */
  [CONSTRAINT_INTEGER]: value => value === true && !target.eq(target.round()) && {
    id: ERROR_FORBIDDEN_FRACTIONAL_PART,
    description: 'Fractional part is forbidden'
  },

  /*
   * Specifies the minimum value allowed.
   * Constraint value is number|string|Big.
   */
  [CONSTRAINT_MIN]: value => target.lt(value) && {
    id: ERROR_MIN_DECEEDED,
    description: `Min ${value} is deceeded`
  },

  /*
   * Specifies the maximum value allowed.
   * Constraint value is number|string|Big.
   */
  [CONSTRAINT_MIN]: value => target.gt(value) && {
    id: ERROR_MAX_EXCEEDED,
    description: `Max ${value} is exceeded`
  }
});

export const

  // ███████████████████████████████████████████████████████████████████████████████████████████████████████████

  /*
   * Input value is a sting.
   * Output is a value converted to targetType.
   * An error is thrown in case of conversion failure.
   */
  format = ({ value, targetType }) => {
    // value is expected to be valid => throwing uncatched NaN on an invalid value:
    return formatters[targetType](new Big(value));
  },

  // ███████████████████████████████████████████████████████████████████████████████████████████████████████████

  /*
   * Input value is of sourceType.
   * Output is a value converted to string.
   * An error is thrown in case of conversion failure.
   */
  parse = ({ value, sourceType }) => {
    try {
      return parsers[sourceType](value);
    } catch(e) {
      throw {
        id: ERROR_INVALID_NUMBER,
        description: 'Invalid number'
      };
    }
  }

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
