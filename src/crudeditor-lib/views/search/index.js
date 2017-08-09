// Edit View container component.
import React from 'react';

import connect from '../../connect';
import Main from '../../../components/SearchMain';
import { getViewModelData } from './selectors';
import { createInstance } from '../create/actions';
import { editInstance } from '../edit/actions';

import {
  deleteInstances,
  resetFormFilter,
  searchInstances,
  toggleSelected,
  toggleSelectedAll,
  updateFormFilter
} from './actions';

const actions = {
  deleteInstances,
  resetFormFilter,
  searchInstances,
  toggleSelected,
  toggleSelectedAll,
  updateFormFilter
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
}
);
