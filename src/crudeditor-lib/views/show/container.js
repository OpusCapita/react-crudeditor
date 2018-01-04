import React from 'react';
import { connect } from 'react-redux';

import Main from '../../../components/ShowMain';
import { viewOperations } from '../lib';
import { VIEW_NAME } from './constants';
import { VIEW_SEARCH } from '../../common/constants';
import { softRedirectView } from '../../common/actions';
import { getTotalCount } from '../search/selectors';

import {
  getViewModelData,
  getViewState,
  getAdjacentInstancesInfo
} from './selectors';

import {
  selectTab,
  showPreviousInstance,
  showNextInstance
} from './actions';

const mergeProps = /* istanbul ignore next */ (
  {
    viewModelData,
    adjacentInstancesExist,
    viewState,
    operations,
    permissions: { crudOperations },
    externalOperations,
    uiConfig: { headerLevel }
  },
  {
    showPreviousInstance,
    showNextInstance,
    softRedirectView,
    exitView,
    ...dispatchProps
  },
  ownProps
) => ({
  ...ownProps,
  viewModel: {
    data: {
      ...viewModelData,
      headerLevel
    },
    actions: {
      ...dispatchProps,
      ...(adjacentInstancesExist.previous && { gotoPreviousInstance: showPreviousInstance }),
      ...(adjacentInstancesExist.next && { gotoNextInstance: showNextInstance }),
      ...(crudOperations.view && { exitView })
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
  },
});

export default connect(
  /* istanbul ignore next */
  (storeState, { modelDefinition, externalOperations, uiConfig }) => ({
    viewModelData: getViewModelData(storeState, modelDefinition),
    adjacentInstancesExist: getAdjacentInstancesInfo(
      storeState,
      getTotalCount.bind(null, storeState) // binding to prevent a call without "view" crudPermissions.
    ),
    viewState: getViewState(storeState, modelDefinition),
    operations: modelDefinition.ui.operations,
    permissions: modelDefinition.permissions,
    externalOperations,
    uiConfig
  }), {
    selectTab,
    exitView: /* istanbul ignore next */ _ => softRedirectView({ name: VIEW_SEARCH }),
    showPreviousInstance,
    showNextInstance,
    softRedirectView
  },
  mergeProps
)(
  /* istanbul ignore next */
  ({ viewModel }) => <Main model={viewModel} />
);
