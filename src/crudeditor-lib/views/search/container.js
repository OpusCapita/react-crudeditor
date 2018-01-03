import React from 'react';
import { connect } from 'react-redux';

import Main from '../../../components/SearchMain';
import { VIEW_NAME } from './constants';
import { VIEW_EDIT, VIEW_SHOW, VIEW_CREATE } from '../../common/constants';
import { viewOperations } from '../lib';

import {
  deleteInstances,
  softRedirectView
} from '../../common/actions';

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
    operations,
    permissions: {
      crudOperations
    },
    externalOperations
  },
  {
    softRedirectView,
    deleteInstances,
    ...dispatchProps
  },
  ownProps
) => ({
  ...ownProps,
  viewModel: {
    data: viewModelData,
    actions: {
      ...dispatchProps,
      ...(crudOperations.create && {
        createInstance: _ => softRedirectView({
          name: VIEW_CREATE,
          state: {
            predefinedFields: defaultNewInstance
          }
        })
      }),
      ...(crudOperations.edit ? {
        editInstance: ({ instance, tab, offset }) => softRedirectView({
          name: VIEW_EDIT,
          state: { instance, tab },
          offset
        })
      } : {
        showInstance: ({ instance, tab, offset }) => softRedirectView({
          name: VIEW_SHOW,
          state: { instance, tab },
          offset
        })
      }),
      ...(crudOperations.delete && { deleteInstances }
      )
    },
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
    defaultNewInstance: getDefaultNewInstance(storeState, modelDefinition),
    viewState: getViewState(storeState, modelDefinition),
    operations: modelDefinition.ui.operations,
    permissions: modelDefinition.permissions,
    externalOperations
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
)(
  ({ viewModel }) => <Main model={viewModel} />
);
