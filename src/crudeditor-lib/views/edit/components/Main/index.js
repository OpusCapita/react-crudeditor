import Main from '../../../../components/CreateEditShow/Main';
import connect from '../../../../connect';
import { selectTab } from '../../actions';

import {
  getActiveTab,
  getFormInstance,
  getInstanceDescription,
  getTabs,
  getViewName
} from '../../selectors';

export default connect({
  instanceDescription : getInstanceDescription,
  tabs                : getTabs,
  activeTab           : getActiveTab,
  formInstance        : getFormInstance,
  viewName            : getViewName
}, {
  selectTab
})(Main);
