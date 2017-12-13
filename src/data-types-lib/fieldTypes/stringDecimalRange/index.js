import baseFieldType from '../stringDecimal';
import { buildRangeFieldType } from '../lib';

import {
  UI_TYPE_DECIMAL_RANGE_OBJECT,
  UI_TYPE_STRING_RANGE_OBJECT,
  UI_TYPE_DECIMAL,
  UI_TYPE_STRING
} from '../../constants';

export default buildRangeFieldType(baseFieldType, {
  [UI_TYPE_DECIMAL_RANGE_OBJECT]: UI_TYPE_DECIMAL,
  [UI_TYPE_STRING_RANGE_OBJECT]: UI_TYPE_STRING
});
