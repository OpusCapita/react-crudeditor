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

const mergeProps = ({ viewModelData }, dispatchProps, ownProps) => ({
  ...ownProps,
  viewModel: {
    data: viewModelData, // FIXME: remove flags from data since they are not used in CRUD Editor components.
    // here we adjust action creators to reflect viewModelData.flags values
    actions: (
      ({
        saveAndNextInstance,
        editAdjacentInstance,
        ...otherActions
      }, {
        nextInstanceExists,
        prevInstanceExists
      }) => {
        let result = { ...otherActions };

        if (nextInstanceExists) {
          result = {
            ...result,
            saveAndNextInstance,
            gotoNextInstance: editAdjacentInstance.bind(null, 'next')
          }
        }

        if (prevInstanceExists) {
          result = {
            ...result,
            gotoPrevInstance: editAdjacentInstance.bind(null, 'prev')
          }
        }

        return result
      })(dispatchProps, viewModelData.flags)
  }
});

export default connect(
  (storeState, { modelDefinition }) => ({
    viewModelData: getViewModelData(storeState, modelDefinition)
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
