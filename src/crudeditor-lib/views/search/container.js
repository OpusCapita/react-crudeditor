// Edit View container component.
import React from 'react';
import { connect } from '../../connectExtended';
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
  resetFormFilter,
  searchInstances,
  toggleSelected,
  toggleSelectedAll,
  updateFormFilter
} from './actions';

const mergeProps = (
  { defaultNewInstance, viewModelData },
  { createInstance, editInstance, showInstance, ...dispatchProps },
  ownProps
) => ({
  ...ownProps,
  viewModel: {
    data: viewModelData,
    actions: {
      ...dispatchProps,
      createInstance: _ => createInstance({ predefinedFields: defaultNewInstance }),
      editInstance: ({
        instance,
        tab,
        index // an index of instance in the array of search results => add navigation to Edit View.
      }) => editInstance({
        instance,
        tab,
        navigation: {
          offset: viewModelData.pageParams.offset + index,
          totalCount: viewModelData.totalCount
        }
      }),
      showInstance: ({
        instance,
        tab,
        index // an index of instance in the array of search results => add navigation to Show View.
      }) => showInstance({
        instance,
        tab,
        navigation: {
          offset: viewModelData.pageParams.offset + index,
          totalCount: viewModelData.totalCount
        }
      })
    }
  },
});

export default connect(
  (storeState, { modelDefinition }) => ({
    viewModelData: getViewModelData(storeState, modelDefinition),
    defaultNewInstance: getDefaultNewInstance(storeState, modelDefinition)
  }),
  {
    createInstance,
    editInstance,
    showInstance,
    deleteInstances,
    resetFormFilter,
    searchInstances,
    toggleSelected,
    toggleSelectedAll,
    updateFormFilter
  },
  mergeProps
)(({ viewModel, children, ...props }) => (
  <Main model={viewModel} {...props}>
    {children}
  </Main>
));
