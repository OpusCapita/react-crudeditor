import React from 'react';

import { connect } from 'react-redux';
import Main from '../../../components/CreateMain';
import { getViewModelData } from './selectors';

// import {
//
// } from './actions';

const mergeProps = ({ viewModelData }, { ...dispatchProps }, ownProps) => ({
  ...ownProps,
  viewModel: {
    data: viewModelData,
    actions: dispatchProps
  }
});

export default connect(
  (storeState, { modelDefinition }) => ({
    viewModelData: getViewModelData(storeState, modelDefinition)
  }), {
    // action creators aka dispatchProps
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
