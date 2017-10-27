import React from 'react';

import { connect } from 'react-redux';
import Main from '../../../components/EditMain';
import { getViewModelData } from './selectors';
import { deleteInstances } from '../../common/actions';


import {
  changeInstanceField,
  exitView,
  saveInstance,
  saveAndNewInstance,
  saveAndNextInstance,
  selectTab,
  validateInstanceField
} from './actions';

const mergeProps = ({ viewModelData }, dispatchProps, ownProps) => ({
  ...ownProps,
  viewModel: {
    data: viewModelData,
    actions: (
      ({ saveAndNextInstance, ...otherActions }) =>
        viewModelData.flags.showSaveAndNext ?
          { saveAndNextInstance, ...otherActions } :
          { ...otherActions }
    )(dispatchProps)
  }
});

export default connect(
  (storeState, { modelDefinition }) => ({
    viewModelData: getViewModelData(storeState, modelDefinition)
  }), {
    changeInstanceField,
    deleteInstances,
    exitView,
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
