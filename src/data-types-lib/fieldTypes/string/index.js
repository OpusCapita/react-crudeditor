import typeNumber from './numberComponentApiType';
import typeString from './stringComponentApiType';

import {
  CONSTRAINT_MIN,
  CONSTRAINT_MAX,

  EMPTY_FIELD_VALUE,

  ERROR_MIN_DECEEDED,
  ERROR_MAX_EXCEEDED,

  COMPONENT_API_TYPE_NUMBER,
  COMPONENT_API_TYPE_STRING
} from '../../constants';

const throwErr = err => { throw err; };

export default {

  isValid: value => value === EMPTY_FIELD_VALUE || typeof value === 'string',

  formatter: {
    [COMPONENT_API_TYPE_NUMBER]: typeNumber.formatter,
    [COMPONENT_API_TYPE_STRING]: typeString.formatter
  },

  parser: {
    [COMPONENT_API_TYPE_NUMBER]: typeNumber.parser,
    [COMPONENT_API_TYPE_STRING]: typeString.parser
  },

  buildValidator: value => ({

    /*
     * Specifies the minimum length allowed.
     * param is a number.
     */
    [CONSTRAINT_MIN]: param => value.length >= param || throwErr({
      id: ERROR_MIN_DECEEDED,
      description: `Min length ${param} is deceeded`
    }),

    /*
     * Specifies the maximum length allowed.
     * param is a number.
     */
    [CONSTRAINT_MAX]: param => value.length <= param || throwErr({
      id: ERROR_MAX_EXCEEDED,
      description: `Max length ${param} is exceeded`
    })
  })
};
