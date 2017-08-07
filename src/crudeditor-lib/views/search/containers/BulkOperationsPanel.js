import connect from '../../../connect';
import BulkOperationsPanel from '../../../../components/SearchBulkOperationsPanel';
import { deleteInstances } from '../actions';
import { getSelectedInstances } from '../selectors';

export default connect({
  selectedInstances: getSelectedInstances
}, {
  deleteInstances
})(BulkOperationsPanel);
