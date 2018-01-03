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

const mergeProps = /* istanbul ignore next */ (
  {
    viewModelData,
    adjacentInstancesExist,
    viewState,
    operations,
    permissions: {
      crudOperations
    },
    externalOperations
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
      ...(adjacentInstancesExist.previous && { gotoPreviousInstance: editPreviousInstance }),
      ...(adjacentInstancesExist.next && { saveAndNextInstance, gotoNextInstance: editNextInstance }),
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
    }
  }
});

export default connect(
  /* istanbul ignore next */
  (storeState, { modelDefinition, externalOperations }) => ({
    viewModelData: getViewModelData(storeState, modelDefinition),
    adjacentInstancesExist: getAdjacentInstancesInfo(
      storeState,
      getTotalCount.bind(null, storeState) // binding to prevent the call without "view" crudPermissions.
    ),
    viewState: getViewState(storeState, modelDefinition),
    operations: modelDefinition.ui.operations,
    permissions: modelDefinition.permissions,
    externalOperations
  }), {
    changeInstanceField,
    deleteInstances,
    exitView: /* istanbul ignore next */ _ => softRedirectView({ name: VIEW_SEARCH }),
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
  /* istanbul ignore next */
  ({ viewModel }) => <Main model={viewModel} />
);
