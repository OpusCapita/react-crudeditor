import booleanUiType from './booleanUiType';
import integerUiType from './integerUiType';
import decimalUiType from './decimalUiType';
import stringUiType from './stringUiType';

import {
  EMPTY_FIELD_VALUE,

  UI_TYPE_BOOLEAN,
  UI_TYPE_INTEGER,
  UI_TYPE_DECIMAL,
  UI_TYPE_STRING
} from '../../constants';

export default {

  isValid: value => value === EMPTY_FIELD_VALUE || typeof value === 'boolean',

  converter: {
    [UI_TYPE_BOOLEAN]: booleanUiType,
    [UI_TYPE_INTEGER]: integerUiType,
    [UI_TYPE_DECIMAL]: decimalUiType,
    [UI_TYPE_STRING]: stringUiType
  },

  buildValidator: value => ({})
};
