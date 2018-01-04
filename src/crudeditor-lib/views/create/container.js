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

const mergeProps = /* istanbul ignore next */ (
  {
    viewModelData,
    viewState,
    operations,
    permissions: { crudOperations },
    externalOperations,
    uiConfig: { headerLevel }
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
    data: {
      ...viewModelData,
      headerLevel
    },
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
  /* istanbul ignore next */
  (storeState, { modelDefinition, externalOperations, uiConfig }) => ({
    viewModelData: getViewModelData(storeState, modelDefinition),
    viewState: getViewState(storeState, modelDefinition),
    operations: modelDefinition.ui.operations,
    permissions: modelDefinition.permissions,
    externalOperations,
    uiConfig
  }), {
    exitView: /* istanbul ignore next */ _ => softRedirectView({ name: VIEW_SEARCH }),
    saveInstance,
    selectTab,
    validateInstanceField,
    changeInstanceField,
    saveAndNewInstance,
    softRedirectView
  },
  mergeProps
)(
  /* istanbul ignore next */
  ({ viewModel }) => <Main model={viewModel} />
);
