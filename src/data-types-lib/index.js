import uiTypes from './uiTypes';
import fieldTypes from './fieldTypes';

import {
  EMPTY_VALUE,

  ERROR_CODE_FORMATING,
  ERROR_CODE_PARSING,
  ERROR_CODE_VALIDATION,

  ERROR_INVALID_FIELD_TYPE_VALUE,
  ERROR_INVALID_UI_TYPE_VALUE,
  ERROR_REQUIRED_MISSING,
  ERROR_UNKNOWN_CONSTRAINT,
  ERROR_UNKNOWN_UI_TYPE,
  ERROR_UNKNOWN_FIELD_TYPE
} from './constants';

export const

  // ███████████████████████████████████████████████████████████████████████████████████████████████████████████

  converter = ({
    fieldType,
    uiType
  }) => (fieldTypes[fieldType] || { converter: {} }).converter[uiType],

  /* ███████████████████████████████████████████████████████████████████████████████████████████████████████████
   *
   * Input value is of fieldType (output of parse-function).
   * Output is boolean true in case of successful validation.
   * An array of errors is thrown in case of validation failure.
   */
  validate = ({
    value,
    type: fieldType,
    constraints: {
      required,
      ...constraints
    },
    throwOnUnknownType = false
  }) => {
    if (value === EMPTY_VALUE) {
      // Ignore validation of EMPTY_VALUE, except for "required" constraint:
      // "required" constraint is relevent only with EMPTY_VALUE.
      if (required) {
        const error = [{
          code: ERROR_CODE_VALIDATION,
          id: ERROR_REQUIRED_MISSING,
          message: 'Required value must be set'
        }];

        throw error;
      }

      return true;
    }

    if (!fieldTypes[fieldType]) {
      if (throwOnUnknownType) {
        const error = {
          code: ERROR_CODE_VALIDATION,
          id: ERROR_UNKNOWN_FIELD_TYPE,
          message: `Unknown Field Type "${fieldType}"`
        };

        throw error;
      }

      return true; // skip validation of unknown Field Type.
    }

    const validator = fieldTypes[fieldType].buildValidator(value);

    const errors = Object.keys(constraints).reduce(
      (errors, name) => {
        if (!validator.hasOwnProperty(name)) {
          return [...errors, {
            code: ERROR_CODE_VALIDATION,
            id: ERROR_UNKNOWN_CONSTRAINT,
            message: `Unable to validate against unknown constraint "${name}"`
          }];
        }

        try {
          validator[name](constraints[name]);
          return errors;
        } catch (error) {
          return [...errors, error];
        }
      },
      []
    );

    if (errors.length) {
      throw errors;
    }

    return true;
  };
