import React from 'react';
import { connect } from 'react-redux';

import Main from '../../../components/EditMain';
import { VIEW_NAME } from './constants';
import {
  VIEW_SEARCH,

  OPERATION_DELETE,
  OPERATION_SAVE,
  OPERATION_SAVEANDNEW,
  OPERATION_SAVEANDNEXT,
  OPERATION_CANCEL,
  OPERATION_HOME
} from '../../common/constants';
import {
  customOperations,
  standardOperations
} from '../lib';

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
    customOpsConfig,
    standardOpsConfig,
    flags: {
      nextInstanceExists,
      prevInstanceExists
    },
    externalOperations,
    uiConfig
  },
  {
    editAdjacentInstance,
    softRedirectView,
    deleteInstances,
    saveInstance,
    saveAndNewInstance,
    saveAndNextInstance,
    ...otherActions
  },
  ownProps
) => ({
  ...ownProps,
  viewModel: {
    data: viewModelData,
    actions: {
      ...otherActions,
      ...(prevInstanceExists ? {
        gotoPrevInstance: _ => editAdjacentInstance('prev')
      } : {}),
      ...(nextInstanceExists ? {
        gotoNextInstance: _ => editAdjacentInstance('next')
      } : {})
    },
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
          [OPERATION_DELETE]: ({ instance }) => deleteInstances([instance]),
          [OPERATION_SAVE]: saveInstance,
          [OPERATION_SAVEANDNEW]: saveAndNewInstance,
          ...(nextInstanceExists ? {
            [OPERATION_SAVEANDNEXT]: saveAndNextInstance
          } : null),
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
    ...(({ flags, ...viewModelData }) => ({
      viewModelData,
      flags
    }))(getViewModelData(storeState, modelDefinition)),
    viewState: getViewState(storeState, modelDefinition),
    customOpsConfig: modelDefinition.ui.customOperations,
    standardOpsConfig: modelDefinition.ui.edit.standardOperations,
    externalOperations,
    uiConfig
  }), {
    changeInstanceField,
    deleteInstances,
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
