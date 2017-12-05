import baseFieldType from '../stringDate';
import { buildRangeFieldType } from '../lib';

import {
  UI_TYPE_DATE_RANGE_OBJECT,
  UI_TYPE_STRING_RANGE_OBJECT,
  UI_TYPE_DATE,
  UI_TYPE_STRING
} from '../../constants';

export default buildRangeFieldType(baseFieldType, {
  [UI_TYPE_DATE_RANGE_OBJECT]: UI_TYPE_DATE,
  [UI_TYPE_STRING_RANGE_OBJECT]: UI_TYPE_STRING
});
