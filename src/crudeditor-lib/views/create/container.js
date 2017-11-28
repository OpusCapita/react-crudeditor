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
    externalOperations
  },
  {
    softRedirectView,
    ...dispatchProps
  },
  ownProps
) => ({
  ...ownProps,
  viewModel: {
    data: viewModelData,
    actions: dispatchProps,
    operations: {
      internal: viewOperations({
        viewName: VIEW_NAME,
        viewState,
        operations,
        softRedirectView
      }),
      external: externalOperations
    }
  }
});

export default connect(
  (storeState, { modelDefinition, externalOperations }) => ({
    viewModelData: getViewModelData(storeState, modelDefinition),
    viewState: getViewState(storeState, modelDefinition),
    operations: modelDefinition.ui.operations,
    externalOperations
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
