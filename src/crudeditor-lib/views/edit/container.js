import React from 'react';
import { connect } from 'react-redux';
import Main from '../../../components/EditMain';
import { getViewModelData, getViewState } from './selectors';
import {
  deleteInstances,
  softRedirectView
} from '../../common/actions';
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
import { VIEW_NAME } from './constants';

const mergeProps = (
  {
    viewModelData,
    viewState,
    operations,
    flags: {
      nextInstanceExists,
      prevInstanceExists
    }
  }, {
    saveAndNextInstance,
    editAdjacentInstance,
    softRedirectView,
    ...otherActions
  },
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
    }))(getViewModelData(storeState, modelDefinition)),
    viewState: getViewState(storeState, modelDefinition),
    operations: modelDefinition.ui.operations
  }), {
    changeInstanceField,
    deleteInstances,
    exitView,
    saveInstance,
    saveAndNewInstance,
    saveAndNextInstance,
    selectTab,
    validateInstanceField,
    editAdjacentInstance,
    softRedirectView
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
