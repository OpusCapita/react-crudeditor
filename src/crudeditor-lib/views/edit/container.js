import React from 'react';

import { connect } from 'react-redux';
import Main from '../../../components/EditMain';
import { getViewModelData } from './selectors';
import { deleteInstances } from '../../common/actions';


import {
  changeInstanceField,
  exitView,
  saveInstance,
  saveAndNewInstance,
  saveAndNextInstance,
  selectTab,
  validateInstanceField,
  editAdjacentInstance
} from './actions';

const mergeProps = ({
  viewModelData,
  flags: {
    nextInstanceExists,
    prevInstanceExists
  }
}, {
  saveAndNextInstance,
  editAdjacentInstance,
  ...otherActions
},
ownProps) => ({
  ...ownProps,
  viewModel: {
    data: viewModelData,
    // here we adjust action creators to reflect flags values
    actions: {
        ...otherActions,
        ...(prevInstanceExists ? {
          gotoPrevInstance: _ => editAdjacentInstance('prev')
        } : {}),
        ...(nextInstanceExists ? {
          saveAndNextInstance,
          gotoNextInstance: _ => editAdjacentInstance('next')
        } : {})
      }
  }
});

export default connect(
  (storeState, { modelDefinition }) => ({
    ...(({ flags, ...viewModelData }) => ({
      viewModelData,
      flags
    }))(getViewModelData(storeState, modelDefinition))
  }), {
    changeInstanceField,
    deleteInstances,
    exitView,
    saveInstance,
    saveAndNewInstance,
    saveAndNextInstance,
    selectTab,
    validateInstanceField,
    editAdjacentInstance
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
