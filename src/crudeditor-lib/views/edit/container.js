import React from 'react';
import { connect } from 'react-redux';

import Main from '../../../components/EditMain';
import { VIEW_NAME } from './constants';
import { VIEW_SEARCH } from '../../common/constants';
import { viewOperations } from '../lib';
import { getTotalCount } from '../search/selectors';

import {
  getViewModelData,
  getViewState,
  getAdjacentInstancesInfo
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
  editPreviousInstance,
  editNextInstance
} from './actions';

const mergeProps = (
  {
    viewModelData,
    adjacentInstancesExist,
    viewState,
    operations,
    permissions: {
      crudOperations
    },
    externalOperations,
    uiConfig
  },
  {
    saveAndNextInstance,
    editPreviousInstance,
    editNextInstance,
    softRedirectView,
    deleteInstances,
    exitView,
    saveAndNewInstance,
    ...dispatchProps
  },
  ownProps
) => ({
  ...ownProps,
  viewModel: {
    data: viewModelData,
    actions: {
      ...dispatchProps,
      ...(adjacentInstancesExist.previous && { editPreviousInstance }),
      ...(adjacentInstancesExist.next && { saveAndNextInstance, editNextInstance }),
      ...(crudOperations.delete && { deleteInstances }),
      ...(crudOperations.view && { exitView }),
      ...(crudOperations.create && { saveAndNewInstance }
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
    },
    uiConfig
  }
});

export default connect(
  (storeState, { modelDefinition, externalOperations, uiConfig }) => ({
    viewModelData: getViewModelData(storeState, modelDefinition),
    adjacentInstancesExist: getAdjacentInstancesInfo(storeState, getTotalCount(storeState)),
    viewState: getViewState(storeState, modelDefinition),
    operations: modelDefinition.ui.operations,
    permissions: modelDefinition.permissions,
    externalOperations,
    uiConfig
  }), {
    changeInstanceField,
    deleteInstances,
    exitView: _ => softRedirectView({ name: VIEW_SEARCH }),
    saveAndNewInstance,
    saveInstance,
    saveAndNextInstance,
    selectTab,
    validateInstanceField,
    editPreviousInstance,
    editNextInstance,
    softRedirectView
  },
  mergeProps
)(
  ({ viewModel }) => <Main model={viewModel} />
);
