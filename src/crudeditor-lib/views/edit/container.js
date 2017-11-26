import React from 'react';
import { connect } from 'react-redux';

import Main from '../../../components/EditMain';
import { VIEW_NAME } from './constants';
import { viewOperations } from '../lib';

import {
  getViewModelData,
  getViewState
} from './selectors';

import {
  deleteInstances,
  softRedirectView
} from '../../common/actions';

import {
  changeInstanceField,
  exitView,
  saveInstance,
  saveAndNewInstance,
  saveAndNextInstance,
  selectTab,
  validateInstanceField,
  editAdjacentInstance
} from './actions';

const mergeProps = (
  {
    viewModelData,
    viewState,
    operations,
    flags: {
      nextInstanceExists,
      prevInstanceExists
    }
  },
  {
    saveAndNextInstance,
    editAdjacentInstance,
    softRedirectView,
    ...otherActions
  },
  ownProps
) => ({
  ...ownProps,
  viewModel: {
    data: {
      ...viewModelData,
      operations: viewOperations({
        viewName: VIEW_NAME,
        viewState,
        operations,
        softRedirectView
      })
    },
    // here we adjust action creators to reflect flags values
    actions: {
      ...otherActions,
      ...(prevInstanceExists ? {
        gotoPrevInstance: _ => editAdjacentInstance('prev')
      } : {}),
      ...(nextInstanceExists ? {
        saveAndNextInstance,
        gotoNextInstance: _ => editAdjacentInstance('next')
      } : {})
    }
  }
});

export default connect(
  (storeState, { modelDefinition }) => ({
    ...(({ flags, ...viewModelData }) => ({
      viewModelData,
      flags
    }))(getViewModelData(storeState, modelDefinition)),
    viewState: getViewState(storeState, modelDefinition),
    operations: modelDefinition.ui.operations
  }), {
    changeInstanceField,
    deleteInstances,
    exitView,
    saveInstance,
    saveAndNewInstance,
    saveAndNextInstance,
    selectTab,
    validateInstanceField,
    editAdjacentInstance,
    softRedirectView
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
