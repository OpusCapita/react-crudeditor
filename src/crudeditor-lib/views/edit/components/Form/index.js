import React from 'react';

import Form from '../../../../components/CreateEditShow/Form';
import connect from '../../../../connect';
//import { actions as searchActions } from '../../../search';

//const { deleteInstances } = searchActions;

import {
  getActiveEntries,
  getPersistentInstance,
  getFormInstance,
  getViewName
} from '../../selectors';

import {
  saveInstance,
  exitEdit
} from '../../actions';

export default connect({
  activeEntries      : getActiveEntries,
  formInstance       : getFormInstance,
  persistentInstance : getPersistentInstance,
  viewName           : getViewName
}, {
  exitEdit,
  saveInstance,
//  deleteInstances
})(Form);
