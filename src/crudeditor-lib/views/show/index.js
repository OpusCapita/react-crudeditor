import React from 'react'
import { connect } from 'react-redux'

import Main from '../../../components/ShowMain'
import { getViewModelData } from './selectors'
import { selectTab, exitView } from './actions'

const mergeProps = ({ viewModelData }, dispatchProps, ownProps) => ({
  ...ownProps,
  viewModel: {
    data: viewModelData,
    actions: dispatchProps
  },
});

export default connect(
  (storeState, { modelDefinition }) => ({
    viewModelData: getViewModelData(storeState, modelDefinition)
  }), {
    selectTab,
    exitView,
    // mute onChange & onBlur handlers
    changeInstanceField: _ => null, // TODO: remove as irrelevant for Show View and change str/components accordingly.
    validateInstanceField: _ => null // TODO: remove as irrelevant for Show View and change str/components accordingly.
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
