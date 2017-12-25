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

const mergeProps = (
  {
    viewModelData,
    adjacentInstancesExist,
    viewState,
    operations,
    externalOperations,
    uiConfig
  },
  {
    showPreviousInstance,
    showNextInstance,
    softRedirectView,
    ...dispatchProps
  },
  ownProps
) => ({
  ...ownProps,
  viewModel: {
    data: viewModelData,
    actions: {
      ...dispatchProps,
      ...(adjacentInstancesExist.previous && { showPreviousInstance }),
      ...(adjacentInstancesExist.next && { showNextInstance })
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
  },
});

export default connect(
  (storeState, { modelDefinition, externalOperations, uiConfig }) => ({
    viewModelData: getViewModelData(storeState, modelDefinition),
    adjacentInstancesExist: getAdjacentInstancesInfo(getTotalCount(storeState)),
    viewState: getViewState(storeState, modelDefinition),
    operations: modelDefinition.ui.operations,
    externalOperations,
    uiConfig
  }), {
    selectTab,
    exitView: _ => softRedirectView({ name: VIEW_SEARCH }),
    showPreviousInstance,
    showNextInstance,
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
