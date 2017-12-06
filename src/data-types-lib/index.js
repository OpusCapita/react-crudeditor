import isEqual from 'lodash/isEqual';

import uiTypes from './uiTypes';
import fieldTypes from './fieldTypes';

import {
  EMPTY_FIELD_VALUE,

  ERROR_CODE_FORMATING,
  ERROR_CODE_PARSING,
  ERROR_CODE_VALIDATION,

  ERROR_INVALID_FIELD_TYPE_VALUE,
  ERROR_INVALID_UI_TYPE_VALUE,
  ERROR_REQUIRED_MISSING,
  ERROR_UNKNOWN_CONSTRAINT
} from './constants';

export const

  // ███████████████████████████████████████████████████████████████████████████████████████████████████████████

  converter = ({
    fieldType,
    uiType
  }) => {
    const converter = (fieldTypes[fieldType] || { converter: {} }).converter[uiType];

    if (!converter) {
      return undefined;
    }

    return {
      format(value) {
        if (!fieldTypes[fieldType].isValid(value)) {
          const error = {
            code: ERROR_CODE_FORMATING,
            id: ERROR_INVALID_FIELD_TYPE_VALUE,
            message: `Invalid value "${value}" of Field Type "${fieldType}"`
          };

          throw error;
        }

        return value === EMPTY_FIELD_VALUE ?
          uiTypes[uiType].EMPTY_VALUE :
          converter.format(value);
      },
      parse(value) {
        if (!uiTypes[uiType].isValid(value)) {
          const error = {
            code: ERROR_CODE_PARSING,
            id: ERROR_INVALID_UI_TYPE_VALUE,
            message: `Invalid value "${value}" of UI Type "${uiType}"`
          };

          throw error;
        }

        return isEqual(value, uiTypes[uiType].EMPTY_VALUE) ?
          EMPTY_FIELD_VALUE :
          converter.parse(value);
      }
    }
  },

  /* ███████████████████████████████████████████████████████████████████████████████████████████████████████████
   *
   * Input value is of fieldType (output of parse-function).
   * Output is boolean true in case of successful validation.
   * An array of errors is thrown in case of validation failure.
   */
  validate = ({
    type: fieldType,
    constraints: {
      required,
      ...constraints
    }
  }) => {
    const { buildValidator } = fieldTypes[fieldType] || {};

    if (!buildValidator) {
      return undefined;
    }

    return value => {
      if (value === EMPTY_FIELD_VALUE) {
        // Ignore validation of EMPTY_FIELD_VALUE, except for "required" constraint:
        // "required" constraint is relevent only with EMPTY_FIELD_VALUE.
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

      const validator = buildValidator(value);

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
    }
  };
