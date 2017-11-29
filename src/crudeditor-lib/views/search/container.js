// Edit View container component.
import React from 'react';
import { connect } from 'react-redux';
import Main from '../../../components/SearchMain';
import { createInstance } from '../create/actions';
import { editInstance } from '../edit/actions';
import {
  deleteInstances,
  softRedirectView
} from '../../common/actions';
import { showInstance } from '../show/actions';
import { VIEW_NAME } from './constants';
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
  { createInstance, editInstance, showInstance, softRedirectView, ...dispatchProps },
  ownProps
) => ({
  ...ownProps,
  viewModel: {
    data: viewModelData,
    actions: {
      ...dispatchProps,
      createInstance: _ => createInstance({ predefinedFields: defaultNewInstance }),
      editInstance: ({
        instance,
        tab,
        index // an index of instance in the array of search results => add navigation to Edit View.
      }) => editInstance({
        instance,
        tab,
        navigation: {
          offset: viewModelData.pageParams.offset + index,
          totalCount: viewModelData.totalCount
        }
      }),
      showInstance: ({
        instance,
        tab,
        index // an index of instance in the array of search results => add navigation to Show View.
      }) => showInstance({
        instance,
        tab,
        navigation: {
          offset: viewModelData.pageParams.offset + index,
          totalCount: viewModelData.totalCount
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
    createInstance,
    editInstance,
    showInstance,
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
