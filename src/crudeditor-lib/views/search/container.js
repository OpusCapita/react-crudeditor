// Edit View container component.
import React from 'react';
import { connect } from 'react-redux';
import Main from '../../../components/SearchMain';
import { createInstance } from '../create/actions';
import { editInstance } from '../edit/actions';
import { deleteInstances } from '../../common/actions';
import { showInstance } from '../show/actions';
import { VIEW_NAME } from './constants';

import {
  getDefaultNewInstance,
  getViewModelData,
  getViewState
} from './selectors';

import {
  resetFormFilter,
  searchInstances,
  toggleSelected,
  toggleSelectedAll,
  updateFormFilter,
  softRedirectView
} from './actions';

const mergeProps = (
  { defaultNewInstance, viewModelData, viewState, operations },
  { createInstance, editInstance, showInstance, softRedirectView, ...dispatchProps },
  ownProps
) => ({
  ...ownProps,
  viewModel: {
    data: {
      ...viewModelData,
      operations: instance => operations(instance, {
        name: VIEW_NAME,
        state: viewState
      }).reduce(
        (rez, { handler, ...rest }) => [
          ...rez,
          {
            ...rest,
            ...(handler ?
              {
                handler: _ => {
                  const view = handler();

                  if (view && view.state && Object.keys(view.state) !== 0) {
                    softRedirectView(view);
                  }
                }
              } :
              {}
            )
          }
        ],
        []
      )
    },
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
  }
});

export default connect(
  (storeState, { modelDefinition }) => ({
    viewModelData: getViewModelData(storeState, modelDefinition),
    defaultNewInstance: getDefaultNewInstance(storeState, modelDefinition),
    viewState: getViewState(storeState, modelDefinition),
    operations: modelDefinition.ui.operations
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
    updateFormFilter,
    softRedirectView
  },
  mergeProps
)(({ viewModel, children, ...props }) => (
  <Main model={viewModel} {...props}>
    {children}
  </Main>
));
