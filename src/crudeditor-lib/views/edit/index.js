import React from 'react';

import connect from '../../connect';
import Main from '../../../components/EditMain';
import { getViewModelData } from './selectors';
import { deleteInstances } from '../search/actions';

import {
  changeInstanceField,
  exitEdit,
  saveInstance,
  saveAndNewInstance,
  saveAndNextInstance,
  selectTab,
  validateInstanceField
} from './actions';

const actions = {
  changeInstanceField,
  deleteInstances,
  exitEdit,
  saveInstance,
  saveAndNewInstance,
  saveAndNextInstance,
  selectTab,
  validateInstanceField
};

export default connect({
  viewModelData: getViewModelData
}, actions)(({
  children,
  viewModelData,
  ...props
}) => {
  const model = {
    data: viewModelData,
    actions: {}
  };

  Object.keys(actions).forEach(actionName => {
    model.actions[actionName] = props[actionName];
    delete props[actionName];
  });

  return <Main {...props} model={model}>{children}</Main>;
});
