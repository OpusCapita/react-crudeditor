// Edit View container component.
import React from 'react';

import { connect } from 'react-redux';
import Main from '../../../components/SearchMain';
import { createInstance } from '../create/actions';
import { editInstance } from '../edit/actions';
import { deleteInstances } from '../../common/actions';
import { showInstance } from '../show/actions';

import {
  getDefaultNewInstance,
  getViewModelData
} from './selectors';

import {
  parseFormFilter,
  resetFormFilter,
  searchInstances,
  toggleSelected,
  toggleSelectedAll,
  updateFormFilter
} from './actions';

const mergeProps = ({ defaultNewInstance, viewModelData }, { createInstance, ...dispatchProps }, ownProps) => ({
  ...ownProps,
  viewModel: {
    data: viewModelData,
    actions: {
      ...dispatchProps,
      createInstance: createInstance.bind(null, { predefinedFields: defaultNewInstance })
    }
  },
});

export default connect(
  (storeState, { modelDefinition }) => ({
    viewModelData: getViewModelData(storeState, modelDefinition),
    defaultNewInstance: getDefaultNewInstance(storeState, modelDefinition)
  }), {
    createInstance,
    deleteInstances,
    editInstance,
    parseFormFilter,
    resetFormFilter,
    searchInstances,
    toggleSelected,
    toggleSelectedAll,
    updateFormFilter,
    showInstance
  },
  mergeProps
)(({
  viewModel,
  children,
  ...props
}) => (<Main model={viewModel} {...props}>
    {children}
  </Main>)
);
