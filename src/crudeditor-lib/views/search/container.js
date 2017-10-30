// Edit View container component.
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Main from '../../../components/SearchMain';
import { createInstance } from '../create/actions';
import { editInstance } from '../edit/actions';
import { deleteInstances } from '../../common/actions';
import { showInstance } from '../show/actions';

import {
  getDefaultNewInstance,
  getViewModelData
} from './selectors';

import {
  parseFormFilter,
  resetFormFilter,
  searchInstances,
  toggleSelected,
  toggleSelectedAll,
  updateFormFilter
} from './actions';

const mergeProps = (
  { defaultNewInstance, viewModelData },
  { createInstance, editInstance, ...dispatchProps },
  ownProps
) => ({
  ...ownProps,
  viewModel: {
    data: viewModelData,
    actions: {
      ...dispatchProps,
      createInstance: createInstance.bind(null, { predefinedFields: defaultNewInstance }),
      editInstance: editInstance({ searchParams: {
        navOffset: viewModelData.pageParams.offset,
        totalCount: viewModelData.totalCount
      } })
    }
  },
});

export default connect(
  (storeState, { modelDefinition }) => ({
    viewModelData: getViewModelData(storeState, modelDefinition),
    defaultNewInstance: getDefaultNewInstance(storeState, modelDefinition)
  }), dispatch => ({
    editInstance: ({ searchParams }) => ({ instance, tab, index }) => dispatch(editInstance({
      instance,
      tab,
      searchParams: {
        ...searchParams,
        // 'index' is an index of instance in the array of search results
        navOffset: searchParams.navOffset + index
      }
    })),
    ...bindActionCreators({
      createInstance,
      deleteInstances,
      parseFormFilter,
      resetFormFilter,
      searchInstances,
      toggleSelected,
      toggleSelectedAll,
      updateFormFilter,
      showInstance
    }, dispatch)
  }),
  mergeProps
)(({
  viewModel,
  children,
  ...props
}) => (<Main model={viewModel} {...props}>
  {children}
</Main>)
);
