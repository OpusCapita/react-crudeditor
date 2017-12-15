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
  OPERATION_HOME
} from '../../common/constants';
import { softRedirectView } from '../../common/actions';

const mergeProps = (
  {
    viewModelData,
    flags,
    viewState,
    customOpsConfig,
    externalOperations,
    standardOpsConfig,
    uiConfig
  },
  {
    softRedirectView,
    ...dispatchProps
  },
  ownProps
) => ({
  ...ownProps,
  viewModel: {
    data: viewModelData,
    actions: (
      ({
        showAdjacentInstance,
        ...otherActions
      }, {
        nextInstanceExists,
        prevInstanceExists
      }) => {
        let result = { ...otherActions };

        if (nextInstanceExists) {
          result = {
            ...result,
            gotoNextInstance: showAdjacentInstance.bind(null, 'next')
          }
        }

        if (prevInstanceExists) {
          result = {
            ...result,
            gotoPrevInstance: showAdjacentInstance.bind(null, 'prev')
          }
        }

        return result
      })(dispatchProps, flags),
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
          [OPERATION_HOME]: _ => softRedirectView({ name: VIEW_SEARCH })
        },
        config: standardOpsConfig
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
