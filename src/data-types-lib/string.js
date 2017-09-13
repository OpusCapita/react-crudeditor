const
  CONSTRAINT_MIN = 'min',
  CONSTRAINT_MAX = 'max',

  ERROR_MIN_DECEEDED = 'minDeceededError',
  ERROR_MAX_EXCEEDED = 'maxExceededError',
  ERROR_UNKNOWN_CONSTRAINT = 'unknownConstraintError',
  ERROR_UNKNOWN_SOURCE_TYPE = 'unknownSourceTypeError',
  ERROR_UNKNOWN_TARGET_TYPE = 'unknownTargetTypeError',

  TYPE_STRING = 'string';

// ███████████████████████████████████████████████████████████████████████████████████████████████████████████

/*
 * Each formatter accepts a string
 * and converts it to the same type as method name
 * or throws an error when unable to convert.
 */
const formatters = {
  [TYPE_STRING]: value => value
};

// ███████████████████████████████████████████████████████████████████████████████████████████████████████████

/*
 * Each parser accepts a value of the same type as method name
 * and converts it to a string
 * or throws an error when unable to convert.
 */
const parsers = {
  [TYPE_STRING]: value => value.trim()
}

// ███████████████████████████████████████████████████████████████████████████████████████████████████████████

/*
 * Each validator is applied to value which is a string
 * and returns falsy value (in case of value passing the validator)
 * or error object otherwise.
 */
const buildValidators = value => ({

  /*
   * Specifies the minimum length allowed.
   * param is number.
   */
  [CONSTRAINT_MIN]: param => value.length < param && {
    id: ERROR_MIN_DECEEDED,
    description: `Min length ${param} is deceeded`
  },

  /*
   * Specifies the maximum length allowed.
   * param is number.
   */
  [CONSTRAINT_MAX]: param => value.length > param && {
    id: ERROR_MAX_EXCEEDED,
    description: `Max length ${param} is exceeded`
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

    return formatters[targetType](value);
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

    return parsers[sourceType](value);
  },

  // ███████████████████████████████████████████████████████████████████████████████████████████████████████████

  /*
   * Input value is a string (output of parse-function).
   * Output is true in case of successful validation
   * An array of errors is thrown in case of validation failure.
   */
  validate = ({ value, constraints }) => {
    // value is expected to be valid => throwing uncatched NaN on an invalid value:
    const validators = buildValidators(value);

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
