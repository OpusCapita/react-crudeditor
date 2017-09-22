import isEqual from 'lodash/isEqual';

import uiTypes from './uiTypes';
import fieldTypes from './fieldTypes';

import {
  EMPTY_FIELD_VALUE,

  ERROR_CODE_FORMATING,
  ERROR_CODE_PARSING,
  ERROR_CODE_VALIDATION,

  ERROR_INVALID_FIELD_TYPE_VALUE,
  ERROR_REQUIRED_MISSING,
  ERROR_UNKNOWN_CONSTRAINT,
  ERROR_UNKNOWN_UI_TYPE,
  ERROR_UNKNOWN_FIELD_TYPE,

  FIELD_TYPE_NUMBER_STRING,
  FIELD_TYPE_STRING
} from './constants';

export const

  /* ███████████████████████████████████████████████████████████████████████████████████████████████████████████
   *
   * Input value is of fieldType.
   * Ouput is the input value converted to uiType.
   * An error is thrown in case of conversion failure.
   */

  format = ({
    value,
    type: fieldType,
    targetType: uiType,

    /*
     * boolean, false by default, which means forwarding a value if (one of the following):
     * (1) input Component API Type is inknown,
     * (2) input Field Type is unknown,
     * (3) input Component API Type is unknown to the Field Type's formatter.
     */
    throwOnUnknownType = false
  }) => {
    if (!fieldTypes[fieldType]) {
      if (throwOnUnknownType) {
        throw {
          code: ERROR_CODE_FORMATING,
          id: ERROR_UNKNOWN_FIELD_TYPE,
          message: `Unknown Field Type "${fieldType}"`
        };
      }

      return value;  // forward value of unknown Field Type.
    }

    if (!fieldTypes[fieldType].isValid(value)) {
      throw {
        code: ERROR_CODE_FORMATING,
        id: ERROR_INVALID_FIELD_TYPE_VALUE,
        message: `Invalid value "${value}" of Field Type "${fieldType}"`
      };
    }

    if (!uiTypes[uiType]) {
      if (throwOnUnknownType) {
        throw {
          code: ERROR_CODE_FORMATING,
          id: ERROR_UNKNOWN_UI_TYPE,
          message: `Unknown Target Type "${uiType}"`
        };
      }

      return value;  // forward value of unknown Component API Type.
    }

    if (value === EMPTY_FIELD_VALUE && uiTypes[uiType].hasOwnProperty('EMPTY_VALUE')) {
        return uiTypes[uiType].EMPTY_VALUE;
    }

    const formatter = fieldTypes[fieldType].formatter;

    if (!formatter[uiType]) {
      if (throwOnUnknownType) {
        throw {
          code: ERROR_CODE_FORMATING,
          id: ERROR_UNKNOWN_UI_TYPE,
          message: `Unknown Target Type "${uiType}" for the formatter`
        };
      }

      return value;  // forward value when Component API Type is unknown to Field Type's formatter.
    }

    return formatter[uiType](value);
  },


  /* ███████████████████████████████████████████████████████████████████████████████████████████████████████████
   *
   * Input value is of uiType.
   * Output is value converted to fieldType.
   * An error is thrown in case of conversion failure.
   */
  parse = ({
    value,
    type: fieldType,
    sourceType: uiType,

    /*
     * boolean, false by default, which means forwarding a value if
     * (1) input Component API Type is inknown,
     * or
     * (2) input Field Type is unknown,
     * or
     * (3) input Component API Type is unknown to the Field Type's parser.
     */
    throwOnUnknownType = false
  }) => {
    if (!uiTypes[uiType]) {
      if (throwOnUnknownType) {
        throw {
          code: ERROR_CODE_PARSING,
          id: ERROR_UNKNOWN_UI_TYPE,
          message: `Unknown Source Type "${uiType}"`
        };
      }

      return value;  // forward value of unknown Component API Type.
    }

    if (!uiTypes[uiType].isValid(value)) {
      throw {
        code: ERROR_CODE_PARSING,
        id: ERROR_INVALID_UI_TYPE_VALUE,
        message: `Invalid value "${value}" of Source Type "${uiType}"`
      };
    }

    if (uiTypes[uiType].isEmpty(value)) {
      return EMPTY_FIELD_VALUE;
    }

    if (!fieldTypes[fieldType]) {
      if (throwOnUnknownType) {
        throw {
          code: ERROR_CODE_PARSING,
          id: ERROR_UNKNOWN_FIELD_TYPE,
          message: `Unknown Field Type "${fieldType}"`
        };
      }

      return value;  // forward value of unknown Field Type.
    }

    const parser = fieldTypes[fieldType].parser;

    if (!parser[uiType]) {
      if (throwOnUnknownType) {
        throw {
          code: ERROR_CODE_PARSING,
          id: ERROR_UNKNOWN_UI_TYPE,
          message: `Unknown Source Type "${uiType}" for the parser`
        };
      }

      return value;  // forward value when Component API Type is unknown to the Field Type's parser.
    }

    return parser[uiType](value);
  },

  /* ███████████████████████████████████████████████████████████████████████████████████████████████████████████
   *
   * Input value is of fieldType (output of parse-function).
   * Output is true in case of successful validation.
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
    if (value === EMPTY_FIELD_VALUE) {
      // Ignore validation of EMPTY_FIELD_VALUE, except for "required" constraint:
      // "required" constraint is relevent only with EMPTY_FIELD_VALUE.
      if (required) {
        throw [{
          code: ERROR_CODE_VALIDATION,
          id: ERROR_REQUIRED_MISSING,
          message: 'Required value must be set'
        }];
      }

      return true;
    }

    if (!fieldTypes[fieldType]) {
      if (throwOnUnknownType) {
        throw {
          code: ERROR_CODE_VALIDATION,
          id: ERROR_UNKNOWN_FIELD_TYPE,
          message: `Unknown Field Type "${fieldType}"`
        };
      }

      return true;  // skip validation of unknown Field Type.
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
        } catch(err) {
          return [...errors, err];
        }
      },
      []
    );

    if (errors.length) {
      throw errors;
    }

    return true;
  };
