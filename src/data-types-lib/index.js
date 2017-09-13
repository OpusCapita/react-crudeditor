import { EMPTY_FIELD_VALUE } from '../crudeditor-lib/common/constants';

import {
  format as formatNumber,
  parse as parseNumber,
  validate as validateNumber
} from './number';

import {
  format as formatString,
  parse as parseString,
  validate as validateString
} from './string';

const NUMBER = 'number';
const STRING = 'string';
const ERROR_UNKNOWN_CLASSIFICATION = 'unknownTypeError';
const ERROR_REQUIRED_MISSING = 'requiredMissingError';

export const

  // ███████████████████████████████████████████████████████████████████████████████████████████████████████████

  format = ({
    value: sourceValue,
    type: classification,
    targetType
  }) => {
    if (sourceValue === EMPTY_FIELD_VALUE) {
      return EMPTY_FIELD_VALUE;
    }

    let formatter;

    switch (classification) {
      case NUMBER:
        formatter = formatNumber;
        break;
      case STRING:
        formatter = formatString;
        break;
      default:
        // Skip formating for unknown classifications and return original string value:
        return sourceValue;
        /*
         * Only known classifications are allowed:
        throw {
          id: ERROR_UNKNOWN_CLASSIFICATION,
          description: `Unknown type "${classification}"`
        };
        */
    }
    return formatter({
      value: sourceValue,
      targetType
    });
  },

  // ███████████████████████████████████████████████████████████████████████████████████████████████████████████

  parse = ({
    value: sourceValue,
    type: classification,
    sourceType
  }) => {
    if (sourceValue === EMPTY_FIELD_VALUE) {
      return EMPTY_FIELD_VALUE;
    }

    let parser;

    switch (classification) {
      case NUMBER:
        parser = parseNumber;
        break;
      case STRING:
        parser = parseString;
        break;
      default:
        // Skip parsing for unknown classifications and return React Component native value:
        return sourceValue;
        /*
         * Only known classifications are allowed:
        throw {
          id: ERROR_UNKNOWN_CLASSIFICATION,
          description: `Unknown type "${classification}"`
        };
        */
    }
    return parser({
      value: sourceValue,
      sourceType
    });
  },

  // ███████████████████████████████████████████████████████████████████████████████████████████████████████████

  validate = ({
    value,
    type: classification,
    constraints: {
      required,
      ...constraints
    }
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

    let validator;

    switch (classification) {
      case NUMBER:
        validator = validateNumber;
        break;
      case STRING:
        validator = validateString;
        break;
      default:
        /*
         * Unknown classifications are ignored:
         */
        return true;
        /*
         * Only known classifications are allowed:
        throw [{
          id: ERROR_REQUIRED_MISSING,
          description: 'Required value must be set'
        }];
        */
    }

    return validator({ value, constraints });
  };
