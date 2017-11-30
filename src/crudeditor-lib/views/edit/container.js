import React from 'react';
import { connect } from 'react-redux';

import Main from '../../../components/EditMain';
import { VIEW_NAME } from './constants';
import { VIEW_SEARCH } from '../../common/constants';
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
    },
    externalOperations,
    uiConfig
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
    data: viewModelData,
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
    },
    operations: {
      internal: viewOperations({
        viewName: VIEW_NAME,
        viewState,
        operations,
        softRedirectView
      }),
      external: externalOperations
    },
    uiConfig
  }
});

export default connect(
  (storeState, { modelDefinition, externalOperations, uiConfig }) => ({
    ...(({ flags, ...viewModelData }) => ({
      viewModelData,
      flags
    }))(getViewModelData(storeState, modelDefinition)),
    viewState: getViewState(storeState, modelDefinition),
    operations: modelDefinition.ui.operations,
    externalOperations,
    uiConfig
  }), {
    changeInstanceField,
    deleteInstances,
    exitView: _ => softRedirectView({ name: VIEW_SEARCH }),
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
