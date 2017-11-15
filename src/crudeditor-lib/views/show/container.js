import React from 'react'
import { connect } from '../../connectExtended'

import Main from '../../../components/ShowMain'
import { getViewModelData } from './selectors'
import { selectTab, exitView, showAdjacentInstance } from './actions'

const mergeProps = ({ viewModelData, flags }, dispatchProps, ownProps) => ({
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
      })(dispatchProps, flags)
  },
});

export default connect(
  (storeState, { modelDefinition }) => ({
    ...(({ flags, ...viewModelData }) => ({
      viewModelData,
      flags
    }))(getViewModelData(storeState, modelDefinition))
  }), {
    selectTab,
    exitView,
    showAdjacentInstance
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
