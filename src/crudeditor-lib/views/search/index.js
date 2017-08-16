// Edit View container component.
import React from 'react';

import { connect } from 'react-redux';
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
  createInstance,
  deleteInstances,
  editInstance,
  resetFormFilter,
  searchInstances,
  toggleSelected,
  toggleSelectedAll,
  updateFormFilter
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
