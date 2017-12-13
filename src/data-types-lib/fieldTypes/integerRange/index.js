import baseFieldType from '../integer';
import { buildRangeFieldType } from '../lib';

import {
  UI_TYPE_INTEGER_RANGE_OBJECT,
  UI_TYPE_STRING_RANGE_OBJECT,
  UI_TYPE_INTEGER,
  UI_TYPE_STRING
} from '../../constants';

export default buildRangeFieldType(baseFieldType, {
  [UI_TYPE_INTEGER_RANGE_OBJECT]: UI_TYPE_INTEGER,
  [UI_TYPE_STRING_RANGE_OBJECT]: UI_TYPE_STRING
});
