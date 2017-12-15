// Edit View container component.
import React from 'react';
import { connect } from 'react-redux';
import Main from '../../../components/SearchMain';
import {
  deleteInstances,
  softRedirectView
} from '../../common/actions';
import { VIEW_NAME } from './constants';
import {
  VIEW_EDIT,
  VIEW_SHOW,
  VIEW_CREATE,

  OPERATION_SHOW,
  OPERATION_EDIT,
  OPERATION_DELETE,
  OPERATION_DELETE_SELECTED,
  OPERATION_CREATE
} from '../../common/constants';
import {
  customOperations,
  standardOperations
} from '../lib';

import {
  getDefaultNewInstance,
  getViewModelData,
  getViewState
} from './selectors';

import {
  resetFormFilter,
  searchInstances,
  toggleSelected,
  toggleSelectedAll,
  updateFormFilter,
  toggleSearchForm
} from './actions';

const mergeProps = (
  {
    defaultNewInstance,
    viewModelData,
    viewState,
    externalOperations,
    customOpsConfig,
    standardOpsConfig,
    uiConfig
  },
  { softRedirectView, deleteInstances, ...dispatchProps },
  ownProps
) => ({
  ...ownProps,
  viewModel: {
    data: viewModelData,
    actions: {
      ...dispatchProps
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
          [OPERATION_DELETE]: ({ instance }) => deleteInstances(instance),
          [OPERATION_DELETE_SELECTED]: ({ instances }) => deleteInstances(instances),
          [OPERATION_SHOW]: ({
            instance,
            tab,
            index // an index of instance in the array of search results => add navigation to Show View.
          }) => softRedirectView({
            name: VIEW_SHOW,
            state: {
              instance,
              tab,
              navigation: {
                offset: viewModelData.pageParams.offset + index,
                totalCount: viewModelData.totalCount
              }
            }
          }),
          [OPERATION_EDIT]: ({
            instance,
            tab,
            index // an index of instance in the array of search results => add navigation to Edit View.
          }) => softRedirectView({
            name: VIEW_EDIT,
            state: {
              instance,
              tab,
              navigation: {
                offset: viewModelData.pageParams.offset + index,
                totalCount: viewModelData.totalCount
              }
            }
          }),
          [OPERATION_CREATE]: _ => softRedirectView({
            name: VIEW_CREATE,
            state: {
              predefinedFields: defaultNewInstance
            }
          }),
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
    defaultNewInstance: getDefaultNewInstance(storeState, modelDefinition),
    viewState: getViewState(storeState, modelDefinition),
    customOpsConfig: modelDefinition.ui.customOperations,
    externalOperations,
    standardOpsConfig: modelDefinition.ui.search.standardOperations,
    uiConfig
  }),
  {
    deleteInstances,
    resetFormFilter,
    searchInstances,
    toggleSelected,
    toggleSelectedAll,
    updateFormFilter,
    softRedirectView,
    toggleSearchForm
  },
  mergeProps
)(({ viewModel, children, ...props }) => (
  <Main model={viewModel} {...props}>
    {children}
  </Main>
));
