// Edit View container component.
import React from 'react';
import { connect } from 'react-redux';
import Main from '../../../components/SearchMain';
import {
  deleteInstances,
  softRedirectView
} from '../../common/actions';
import { VIEW_NAME } from './constants';
import { VIEW_EDIT, VIEW_SHOW, VIEW_CREATE } from '../../common/constants';
import { viewOperations } from '../lib';

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
  { defaultNewInstance, viewModelData, viewState, operations, externalOperations, uiConfig },
  { softRedirectView, ...dispatchProps },
  ownProps
) => ({
  ...ownProps,
  viewModel: {
    data: viewModelData,
    actions: {
      ...dispatchProps,
      createInstance: _ => softRedirectView({
        name: VIEW_CREATE,
        state: {
          predefinedFields: defaultNewInstance
        }
      }),
      editInstance: ({
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
      showInstance: ({
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
      })
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
    viewModelData: getViewModelData(storeState, modelDefinition),
    defaultNewInstance: getDefaultNewInstance(storeState, modelDefinition),
    viewState: getViewState(storeState, modelDefinition),
    operations: modelDefinition.ui.operations,
    externalOperations,
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
