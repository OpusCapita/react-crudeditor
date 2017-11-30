import React from 'react';
import { connect } from 'react-redux';

import Main from '../../../components/ErrorMain';
import { getViewModelData } from './selectors';
import { softRedirectView } from '../../common/actions';
import { VIEW_SEARCH } from '../../common/constants';

const mergeProps = ({ viewModelData, uiConfig }, dispatchProps, ownProps) => ({
  ...ownProps,
  viewModel: {
    data: viewModelData,
    actions: dispatchProps,
    uiConfig
  },
});

export default connect(
  (storeState, { modelDefinition, uiConfig }) => ({
    viewModelData: getViewModelData(storeState, modelDefinition),
    uiConfig
  }),
  {
    goHome: _ => softRedirectView({
      name: VIEW_SEARCH
    })
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
