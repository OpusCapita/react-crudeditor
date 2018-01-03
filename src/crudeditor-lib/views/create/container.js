import React from 'react';
import { connect } from 'react-redux';

import Main from '../../../components/CreateMain';
import { softRedirectView } from '../../common/actions';
import { viewOperations } from '../lib';
import { VIEW_NAME } from './constants';
import { VIEW_SEARCH } from '../../common/constants';

import {
  getViewModelData,
  getViewState
} from './selectors';

import {
  saveInstance,
  selectTab,
  validateInstanceField,
  changeInstanceField,
  saveAndNewInstance
} from './actions';

const mergeProps = (
  {
    viewModelData,
    viewState,
    operations,
    permissions: {
      crudOperations
    },
    externalOperations
  },
  {
    softRedirectView,
    exitView,
    ...dispatchProps
  },
  ownProps
) => ({
  ...ownProps,
  viewModel: {
    data: viewModelData,
    actions: {
      ...dispatchProps,
      ...(crudOperations.view && { exitView })
    },
    operations: {
      internal: viewOperations({
        viewName: VIEW_NAME,
        viewState,
        operations,
        softRedirectView
      }),
      external: externalOperations
    }
  }
});

export default connect(
  (storeState, { modelDefinition, externalOperations }) => ({
    viewModelData: getViewModelData(storeState, modelDefinition),
    viewState: getViewState(storeState, modelDefinition),
    operations: modelDefinition.ui.operations,
    permissions: modelDefinition.permissions,
    externalOperations
  }), {
    exitView: _ => softRedirectView({ name: VIEW_SEARCH }),
    saveInstance,
    selectTab,
    validateInstanceField,
    changeInstanceField,
    saveAndNewInstance,
    softRedirectView
  },
  mergeProps
)(
  ({ viewModel }) => <Main model={viewModel} />
);
