import connect from '../../../connect';
import Tab from '../../../../components/EditTab';
import { deleteInstances } from '../../search/actions';

import {
  getFormInstance,
  getPersistentInstance
} from '../selectors';

import {
  exitEdit,
  saveInstance,
  saveAndNewInstance,
  saveAndNextInstance
} from '../actions';

export default connect({
  formInstance: getFormInstance,
  persistentInstance: getPersistentInstance
}, {
  deleteInstances,
  exitEdit,
  saveInstance,
  saveAndNewInstance,
  saveAndNextInstance
})(Tab);
