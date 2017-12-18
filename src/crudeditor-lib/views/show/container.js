import React from 'react';
import { connect } from 'react-redux';
import Main from '../../../components/ShowMain';
import {
  getViewModelData,
  getViewState
} from './selectors';
import {
  selectTab,
  showAdjacentInstance
} from './actions';
import {
  customOperations,
  standardOperations
} from '../lib';
import { VIEW_NAME } from './constants';
import {
  VIEW_SEARCH,
  OPERATION_CANCEL,
  OPERATION_HOME,
  OPERATION_NEXT,
  OPERATION_PREV
} from '../../common/constants';
import { softRedirectView } from '../../common/actions';

const mergeProps = (
  {
    viewModelData,
    flags: {
      nextInstanceExists,
      prevInstanceExists
    },
    viewState,
    customOpsConfig,
    externalOperations,
    standardOpsConfig,
    uiConfig
  },
  {
    softRedirectView,
    showAdjacentInstance,
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
          [OPERATION_CANCEL]: _ => softRedirectView({ name: VIEW_SEARCH }),
          [OPERATION_HOME]: _ => softRedirectView({ name: VIEW_SEARCH }),
          [OPERATION_PREV]: _ => showAdjacentInstance('prev'),
          [OPERATION_NEXT]: _ => showAdjacentInstance('next')
        },
        config: {
          ...(standardOperations || {}),
          prev: _ => ({
            disabled: !prevInstanceExists
          }),
          next: _ => ({
            disabled: !nextInstanceExists
          })
        }
      })
    },
    uiConfig
  },
});

export default connect(
  (storeState, { modelDefinition, externalOperations, uiConfig }) => ({
    ...(({ flags, ...viewModelData }) => ({
      viewModelData,
      flags
    }))(getViewModelData(storeState, modelDefinition)),
    viewState: getViewState(storeState, modelDefinition),
    customOpsConfig: modelDefinition.ui.customOperations,
    standardOpsConfig: modelDefinition.ui.show.standardOperations,
    externalOperations,
    uiConfig
  }), {
    selectTab,
    showAdjacentInstance,
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
