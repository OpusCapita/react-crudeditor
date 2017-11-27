import React from 'react';
import { connect } from 'react-redux';
import Main from '../../../components/ShowMain';
import {
  getViewModelData,
  getViewState
} from './selectors';
import {
  selectTab,
  exitView,
  showAdjacentInstance
} from './actions';
import { viewOperations } from '../lib';
import { VIEW_NAME } from './constants';
import { softRedirectView } from '../../common/actions';

const mergeProps = (
  {
    viewModelData,
    flags,
    viewState,
    operations,
    onExternalOperation
  },
  {
    softRedirectView,
    ...dispatchProps
  },
  ownProps
) => ({
  ...ownProps,
  viewModel: {
    data: {
      ...viewModelData,
      operations: viewOperations({
        viewName: VIEW_NAME,
        viewState,
        operations,
        softRedirectView,
        onExternalOperation
      })
    },
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
      })(dispatchProps, flags)
  },
});

export default connect(
  (storeState, { modelDefinition, onExternalOperation }) => ({
    ...(({ flags, ...viewModelData }) => ({
      viewModelData,
      flags
    }))(getViewModelData(storeState, modelDefinition)),
    viewState: getViewState(storeState, modelDefinition),
    operations: modelDefinition.ui.operations,
    onExternalOperation
  }), {
    selectTab,
    exitView,
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
