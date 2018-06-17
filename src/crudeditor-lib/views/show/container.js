import React from 'react';
import { connect } from 'react-redux';
import Main from '../../../components/ShowMain';
import { expandExternalOperation, expandCustomOperation } from '../lib';
import { VIEW_NAME } from './constants';
import { VIEW_SEARCH, PERMISSION_VIEW } from '../../common/constants';
import { isAllowed } from '../../lib';
import { softRedirectView } from '../../common/actions';
import { getTotalCount } from '../search/selectors';
import {
  getViewModelData,
  getViewState,
  getAdjacentInstancesInfo
} from './selectors';
import {
  selectTab,
  showPreviousInstance,
  showNextInstance
} from './actions';

const mergeProps = /* istanbul ignore next */ (
  {
    viewModelData: {
      persistentInstance: instance,
      ...restData
    },
    adjacentInstancesExist,
    viewState,
    permissions: { crudOperations },
    customOperations,
    externalOperations,
    uiConfig
  },
  {
    showPreviousInstance,
    showNextInstance,
    softRedirectView,
    exitView,
    ...dispatchProps
  },
  { i18n }
) => ({
  viewModel: {
    uiConfig,

    data: {
      persistentInstance: instance,
      ...restData
    },

    actions: {
      ...dispatchProps,
      ...(adjacentInstancesExist.previous && { gotoPreviousInstance: showPreviousInstance }),
      ...(adjacentInstancesExist.next && { gotoNextInstance: showNextInstance }),
      ...(isAllowed(crudOperations, PERMISSION_VIEW) && { exitView })
    },

    /*
     * "show" property is removed from each custom/external operation
     * since operations with "show" set to "false" are not included in the result array.
     */
    operations: viewState ? [
      ...(isAllowed(crudOperations, PERMISSION_VIEW) && [{
        title: i18n.getMessage('crudEditor.cancel.button'),
        handler: exitView,
        style: 'link'
      }]),
      ...[
        ...customOperations(instance).map(expandCustomOperation({
          viewName: VIEW_NAME,
          viewState,
          softRedirectView
        })),
        ...externalOperations(instance).map(expandExternalOperation({
          viewName: VIEW_NAME,
          viewState
        }))
      ].
        filter(operation => operation)
    ] :
      [] // viewState is undefined when view is not initialized yet (ex. during Hard Redirect).
  }
});

export default connect(
  /* istanbul ignore next */
  (storeState, { modelDefinition, externalOperations, uiConfig }) => ({
    viewModelData: getViewModelData(storeState, modelDefinition),
    adjacentInstancesExist: getAdjacentInstancesInfo(
      storeState,
      getTotalCount.bind(null, storeState) // binding to prevent a call without "view" crudPermissions.
    ),
    viewState: getViewState(storeState, modelDefinition),
    permissions: modelDefinition.permissions,
    customOperations: modelDefinition.ui.customOperations,
    externalOperations,
    uiConfig
  }), {
    selectTab,
    exitView: /* istanbul ignore next */ _ => softRedirectView({ name: VIEW_SEARCH }),
    showPreviousInstance,
    showNextInstance,
    softRedirectView
  },
  mergeProps
)(
  /* istanbul ignore next */
  ({ viewModel }) => <Main model={viewModel} />
);
