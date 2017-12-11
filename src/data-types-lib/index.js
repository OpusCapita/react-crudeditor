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
      format({ value, i18n }) {
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
          converter.format({ value, i18n });
      },
      parse({ value, i18n }) {
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
          converter.parse({ value, i18n });
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
      validate: customValidate,
      ...constraints
    }
  }) => {
    const { buildValidator } = fieldTypes[fieldType] || {};

    if (!buildValidator) {
      return undefined;
    }

    return (value, instance) => {
      const errors = [];

      if (customValidate) {
        try {
          customValidate(value, instance);
        } catch (error) {
          errors.push(...(Array.isArray(error) ? error : [error]));
        }
      }

      if (value === EMPTY_FIELD_VALUE) {
        // Ignore validation of EMPTY_FIELD_VALUE, except for "required" constraint:
        // "required" constraint is relevent only with EMPTY_FIELD_VALUE.
        if (required) {
          errors.push({
            code: ERROR_CODE_VALIDATION,
            id: ERROR_REQUIRED_MISSING,
            message: 'Required value must be set'
          });
        }
      } else {
        const validator = buildValidator(value);

        Object.keys(constraints).forEach(name => {
          if (validator.hasOwnProperty(name)) {
            try {
              validator[name](constraints[name]);
            } catch (error) {
              errors.push(...(Array.isArray(error) ? error : [error]));
            }
          } else {
            errors.push({
              code: ERROR_CODE_VALIDATION,
              id: ERROR_UNKNOWN_CONSTRAINT,
              message: `Unable to validate against unknown constraint "${name}"`
            });
          }
        });
      }

      if (errors.length) {
        throw errors;
      }

      return true;
    }
  };
