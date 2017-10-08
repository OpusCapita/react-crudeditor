// Edit View container component.
import React from 'react';
import { connect } from 'react-redux';

import Main from '../../../components/ErrorMain';
import { getViewModelData } from './selectors';
import { goHome } from './actions';

const mergeProps = (viewModelData, dispatchProps, ownProps) => ({
  ...ownProps,
  viewModel: {
    data: viewModelData,
    actions: dispatchProps
  },
});

export default connect(
  (storeState, { modelDefinition }) => getViewModelData(storeState, modelDefinition),
  { goHome },
  mergeProps
)(({
  viewModel,
  children,
  ...props
}) =>
  <Main model={viewModel} {...props}>
    {children}
  </Main>
);
