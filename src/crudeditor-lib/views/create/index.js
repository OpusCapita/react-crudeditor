import React from 'react';

import { connect } from 'react-redux';
import Main from '../../../components/CreateMain';
import { getViewModelData } from './selectors';
// import { getDefaultNewInstance } from '../search/selectors';
// import { createInstance } from './actions';

import {
  exitView,
  saveInstance
} from './actions';

const mergeProps = ({ viewModelData, defaultNewInstance }, { ...dispatchProps }, ownProps) => ({
  ...ownProps,
  viewModel: {
    data: viewModelData,
    actions: {
      ...dispatchProps,
      // createInstance: createInstance.bind(null, { instance: defaultNewInstance })
    }
  }
});

export default connect(
  (storeState, { modelDefinition }) => ({
    viewModelData: getViewModelData(storeState, modelDefinition),
    // defaultNewInstance: getDefaultNewInstance(storeState, modelDefinition)
  }), {
    exitView,
    saveInstance
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
