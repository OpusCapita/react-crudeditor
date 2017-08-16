import React from 'react';

import { connect } from 'react-redux';
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

export default connect(
  (storeState, { modelDefinition }) => ({
    viewModelData: getViewModelData(storeState, modelDefinition)
  }),
  actions
)(({
  children,
  viewModelData,
  ...props
}) =>
  <Main
    model={{
      data: viewModelData,
      actions: Object.keys(actions).reduce(
        (rez, actionName) => {
          rez[actionName] = props[actionName];
          delete props[actionName];
          return rez;
        },
        {}
      )
    }}
    {...props}
  >
    {children}
  </Main>
);
