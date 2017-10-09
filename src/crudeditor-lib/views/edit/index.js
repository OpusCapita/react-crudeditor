import React from 'react';

import { connect } from 'react-redux';
import Main from '../../../components/EditMain';
import { getViewModelData } from './selectors';
import { deleteInstances } from '../../common/actions';

import {
  changeInstanceField,
  exitEdit,
  saveInstance,
  saveAndNewInstance,
  saveAndNextInstance,
  selectTab,
  validateInstanceField
} from './actions';

const mergeProps = ({ viewModelData }, { ...dispatchPorps }, ownProps) => ({
  ...ownProps,
  viewModel: {
    data: viewModelData,
    actions: dispatchPorps
  }
});

export default connect(
  (storeState, { modelDefinition }) => ({
    viewModelData: getViewModelData(storeState, modelDefinition)
  }), {
    changeInstanceField,
    deleteInstances,
    exitView: exitEdit,
    saveInstance,
    saveAndNewInstance,
    saveAndNextInstance,
    selectTab,
    validateInstanceField
  },
  mergeProps
)(({
  viewModel,
  children,
  ...props
}) =>
  (<Main model={viewModel} {...props}>
    {children}
  </Main>)
);
