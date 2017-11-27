import React from 'react';
import { connect } from 'react-redux';

import Main from '../../../components/CreateMain';
import { softRedirectView } from '../../common/actions';
import { viewOperations } from '../lib';
import { VIEW_NAME } from './constants';

import {
  getViewModelData,
  getViewState
} from './selectors';

import {
  exitView,
  saveInstance,
  selectTab,
  validateInstanceField,
  changeInstanceField,
  saveAndNewInstance
} from './actions';

const mergeProps = (
  {
    viewModelData,
    viewState,
    operations,
    onExternalOperation
  },
  {
    softRedirectView,
    ...dispatchProps
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
        softRedirectView,
        onExternalOperation
      })
    },
    actions: dispatchProps
  }
});

export default connect(
  (storeState, { modelDefinition, onExternalOperation }) => ({
    viewModelData: getViewModelData(storeState, modelDefinition),
    viewState: getViewState(storeState, modelDefinition),
    operations: modelDefinition.ui.operations,
    onExternalOperation
  }), {
    exitView,
    saveInstance,
    selectTab,
    validateInstanceField,
    changeInstanceField,
    saveAndNewInstance,
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
