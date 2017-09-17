import isEqual from 'lodash/isEqual';

import componentApiTypes from './componentApiTypes';
import fieldTypes from './fieldTypes';

import {
  FIELD_TYPE_NUMBER,
  FIELD_TYPE_STRING,

  EMPTY_FIELD_VALUE,

  ERROR_REQUIRED_MISSING,
  ERROR_UNKNOWN_CONSTRAINT,
  ERROR_UNKNOWN_COMPONENT_API_TYPE,
  ERROR_UNKNOWN_FIELD_TYPE
} from './constants';

export const

  /* ███████████████████████████████████████████████████████████████████████████████████████████████████████████
   *
   * Input value is of fieldType.
   * Ouput is the input value converted to componentApiType.
   * An error is thrown in case of conversion failure.
   */

  format = ({
    value,
    type: fieldType,
    targetType: componentApiType,

    /*
     * boolean, false by default, which means forwarding a value if
     * (1) input Component API Type is inknown,
     * or
     * (2) input Field Type is unknown,
     * or
     * (3) input Component API Type is unknown to the Field Type's formatter.
     */
    throwOnUnknownType = false
  }) => {
    if (!fieldTypes[fieldType]) {
      if (throwOnUnknownType) {
        throw {
          id: ERROR_UNKNOWN_FIELD_TYPE,
          description: `Unknown Field Type "${fieldType}"`
        };
      }

      return value;  // forward value of unknown Field Type.
    }

    if (!fieldTypes[fieldType].isValid(value)) {
      throw {
        id: ERROR_INVALID_FIELD_TYPE_VALUE,
        description: `Invalid value "${value}" of Field Type "${fieldType}"`
      };
    }

    if (!componentApiTypes[componentApiType]) {
      if (throwOnUnknownType) {
        throw {
          id: ERROR_UNKNOWN_COMPONENT_API_TYPE,
          description: `Unknown Target Type "${componentApiType}"`
        };
      }

      return value;  // forward value of unknown Component API Type.
    }

    if (value === EMPTY_FIELD_VALUE && componentApiTypes[componentApiType].hasOwnProperty('EMPTY_VALUE')) {
        return componentApiTypes[componentApiType].EMPTY_VALUE;
    }

    const formatter = fieldTypes[fieldType].formatter;

    if (!formatter[componentApiType]) {
      if (throwOnUnknownType) {
        throw {
          id: ERROR_UNKNOWN_COMPONENT_API_TYPE,
          description: `Unknown Target Type "${componentApiType}" for the formatter`
        };
      }

      return value;  // forward value when Component API Type is unknown to Field Type's formatter.
    }

    return formatter[componentApiType](value);
  },


  /* ███████████████████████████████████████████████████████████████████████████████████████████████████████████
   *
   * Input value is of componentApiType.
   * Output is value converted to fieldType.
   * An error is thrown in case of conversion failure.
   */
  parse = ({
    value,
    type: fieldType,
    sourceType: componentApiType,

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
    if (!componentApiTypes[componentApiType]) {
      if (throwOnUnknownType) {
        throw {
          id: ERROR_UNKNOWN_COMPONENT_API_TYPE,
          description: `Unknown Source Type "${componentApiType}"`
        };
      }

      return value;  // forward value of unknown Component API Type.
    }

    if (!componentApiTypes[componentApiType].isValid(value)) {
      throw {
        id: ERROR_INVALID_COMPONENT_API_TYPE_VALUE,
        description: `Invalid value "${value}" of Source Type "${componentApiType}"`
      };
    }

    if (componentApiTypes[componentApiType].isEmpty(value)) {
      return EMPTY_FIELD_VALUE;
    }

    if (!fieldTypes[fieldType]) {
      if (throwOnUnknownType) {
        throw {
          id: ERROR_UNKNOWN_FIELD_TYPE,
          description: `Unknown Field Type "${fieldType}"`
        };
      }

      return value;  // forward value of unknown Field Type.
    }

    const parser = fieldTypes[fieldType].parser;

    if (!parser[componentApiType]) {
      if (throwOnUnknownType) {
        throw {
          id: ERROR_UNKNOWN_COMPONENT_API_TYPE,
          description: `Unknown Source Type "${componentApiType}" for the parser`
        };
      }

      return value;  // forward value when Component API Type is unknown to the Field Type's parser.
    }

    return parser[componentApiType](value);
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
      if (required) {  // "required" constraint is relevent only with EMPTY_FIELD_VALUE.
        throw [{
          id: ERROR_REQUIRED_MISSING,
          description: 'Required value must be set'
        }];
      }

      return true;
    }

    let buildValidator;

    switch (fieldType) {
      case FIELD_TYPE_NUMBER:
        buildValidator = buildNumberValidator;
        break;
      case FIELD_TYPE_STRING:
        buildValidator = buildStringValidator;
        break;
      default:
        if (throwOnUnknownType) {
          throw [{
            id: ERROR_UNKNOWN_FIELD_TYPE,
            description: `Unknown Field Type "${fieldType}"`
          }];
        }

        return true;  // ignore unknown Field Type.
    }

    const validator = buildValidator(value);

    const errors = Object.keys(constraints).reduce(
      (errors, name) => {
        if (!validator.hasOwnProperty(name)) {
          return [...errors, {
            id: ERROR_UNKNOWN_CONSTRAINT,
            description: `Unable to validate against unknown constraint "${name}"`
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
