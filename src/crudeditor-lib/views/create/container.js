import React from 'react';
import { connect } from 'react-redux';

import Main from '../../../components/CreateMain';
import { softRedirectView } from '../../common/actions';
import {
  customOperations,
  standardOperations
} from '../lib';
import { VIEW_NAME } from './constants';
import {
  VIEW_SEARCH,

  OPERATION_SAVE,
  OPERATION_SAVEANDNEW,
  OPERATION_CANCEL,
  OPERATION_HOME
} from '../../common/constants';

import {
  getViewModelData,
  getViewState
} from './selectors';

import {
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
    customOpsConfig,
    standardOpsConfig,
    externalOperations,
    uiConfig
  },
  {
    softRedirectView,
    saveInstance,
    saveAndNewInstance,
    ...dispatchProps
  },
  ownProps
) => ({
  ...ownProps,
  viewModel: {
    data: viewModelData,
    actions: dispatchProps,
    operations: {
      custom: customOperations({
        viewName: VIEW_NAME,
        viewState,
        operations: customOpsConfig,
        softRedirectView
      }),
      external: externalOperations,
      standard: standardOperations({
        handlers: {
          [OPERATION_SAVE]: saveInstance,
          [OPERATION_SAVEANDNEW]: saveAndNewInstance,
          [OPERATION_CANCEL]: _ => softRedirectView({ name: VIEW_SEARCH }),
          [OPERATION_HOME]: _ => softRedirectView({ name: VIEW_SEARCH })
        },
        config: standardOpsConfig
      })
    },
    uiConfig
  }
});

export default connect(
  (storeState, { modelDefinition, externalOperations, uiConfig }) => ({
    viewModelData: getViewModelData(storeState, modelDefinition),
    viewState: getViewState(storeState, modelDefinition),
    customOpsConfig: modelDefinition.ui.customOperations,
    standardOpsConfig: modelDefinition.ui.create.standardOperations,
    externalOperations,
    uiConfig
  }), {
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
