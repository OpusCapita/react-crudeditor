import connect from '../../../connect';
import PaginationPanel from '../../../../components/SearchPaginationPanel';
import { searchInstances } from '../actions';

import {
  getPageMax,
  getPageOffset,
  getTotalCount
} from '../selectors';

export default connect({
  max: getPageMax,
  offset: getPageOffset,
  totalCount: getTotalCount
}, {
  searchInstances
})(PaginationPanel);
