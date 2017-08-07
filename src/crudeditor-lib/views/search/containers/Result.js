import connect from '../../../connect';
import Result from '../../../../components/SearchResult';
import { getTotalCount } from '../selectors';

export default connect({
  totalCount: getTotalCount
})(Result);
