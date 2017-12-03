import booleanUiType from './booleanUiType';
import numberUiType from './numberUiType';
import stringUiType from './stringUiType';

import {
  EMPTY_FIELD_VALUE,

  UI_TYPE_BOOLEAN,
  UI_TYPE_NUMBER,
  UI_TYPE_STRING
} from '../../constants';

export default {

  isValid: value => value === EMPTY_FIELD_VALUE || typeof value === 'boolean',

  converter: {
    [UI_TYPE_BOOLEAN]: booleanUiType,
    [UI_TYPE_NUMBER]: numberUiType,
    [UI_TYPE_STRING]: stringUiType
  },

  buildValidator: value => ({})
};
