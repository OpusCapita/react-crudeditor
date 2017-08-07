import connect from '../../../connect';
import Heading from '../../../../components/EditHeading';
import { getEntityName } from '../../../common/selectors';

import {
  getActiveTab,
  getInstanceDescription,
  getTabs
} from '../selectors';

import {
  selectTab
} from '../actions';

export default connect({
  activeTab: getActiveTab,
  entityName: getEntityName,
  instanceDescription: getInstanceDescription,
  tabs: getTabs
}, {
  selectTab
})(Heading);
