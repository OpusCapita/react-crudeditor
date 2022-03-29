import React from 'react';
import { connect } from 'react-redux';

import Main from '../../../components/SearchMain';
import { VIEW_NAME } from './constants';
import {
  VIEW_EDIT,
  VIEW_SHOW,
  VIEW_CREATE,
  PERMISSION_CREATE,
  PERMISSION_DELETE,
  PERMISSION_EDIT
} from '../../common/constants';
import { expandExternalOperation, expandCustomOperation } from '../lib';
import { isAllowed } from '../../lib';
import {
  deleteInstances,
  customBulkAction,
  softRedirectView
} from '../../common/actions';

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
  updateGotoPage,
  toggleSearchForm
} from './actions';

const mergeProps = /* istanbul ignore next */ (
  {
    defaultNewInstance,
    viewModelData: {
      selectedInstances,
      ...restData
    },
    viewState,
    permissions: { crudOperations },
    customOperations,
    externalOperations,
    customBulkOperations,
    uiConfig
  },
  {
    softRedirectView,
    deleteInstances,
    customBulkAction,
    ...dispatchProps
  },
  { i18n }
) => ({
  viewModel: {
    uiConfig,

    data: {
      selectedInstances,
      ...restData
    },

    actions: {
      ...dispatchProps,
      ...(isAllowed(crudOperations, PERMISSION_CREATE) && {
        createInstance: _ => softRedirectView({
          name: VIEW_CREATE,
          state: {
            predefinedFields: defaultNewInstance
          }
        })
      })
    },

    permissions: {
      // return the user's permission to delete ALL instances passed as arguments.
      delete: (...instances) => isAllowed(crudOperations, PERMISSION_DELETE) && (
        instances.length === 0 ||
        instances.every(instance => isAllowed(crudOperations, PERMISSION_DELETE, { instance }))
      )
    },

    /*
     * Operations requiring confirmation
     * are supplied with "confirm" property containing an object with translation texts for Confirm Dialog.
     *
     * "show" property is removed from each custom/external operation
     * since operations with "show" set to "false" are not included in the result array.
     */
    instanceOperations: ({ instance, offset }) => {
      if (!viewState) {
        return [] // viewState is undefined when view is not initialized yet (ex. during Hard Redirect).
      }

      const canEdit = isAllowed(crudOperations, PERMISSION_EDIT, { instance });

      return [
        {
          title: i18n.getMessage(`common.CrudEditor.${ canEdit ? 'edit' : 'show' }.button`),
          icon: canEdit ? 'edit' : 'eye-open',
          handler: _ => softRedirectView({
            name: canEdit ? VIEW_EDIT : VIEW_SHOW,
            state: { instance },
            offset
          })
        },
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
          filter(operation => operation),
        ...(isAllowed(crudOperations, PERMISSION_DELETE, { instance }) && [{
          title: i18n.getMessage('common.CrudEditor.delete.button'),
          icon: 'trash',
          handler: _ => deleteInstances(instance),
          confirm: {
            message: i18n.getMessage('common.CrudEditor.delete.confirmation'),
            textConfirm: i18n.getMessage('common.CrudEditor.delete.button'),
            textCancel: i18n.getMessage('common.CrudEditor.cancel.button')
          }
        }])
      ]
    },

    bulkOperations: viewState ? {
      ...(isAllowed(crudOperations, PERMISSION_DELETE) && {
        delete: {
          title: i18n.getMessage('common.CrudEditor.deleteSelected.button'),
          disabled: selectedInstances.length === 0 ||
            selectedInstances.some(instance => !isAllowed(crudOperations, PERMISSION_DELETE, { instance })),
          handler: _ => deleteInstances(selectedInstances),
          confirm: {
            message: i18n.getMessage('common.CrudEditor.deleteSelected.confirmation'),
            textConfirm: i18n.getMessage('common.CrudEditor.delete.button'),
            textCancel: i18n.getMessage('common.CrudEditor.cancel.button')
          }
        }
      })
    } :
      {}, // viewState is undefined when view is not initialized yet (ex. during Hard Redirect).
    customBulkOperations: customBulkOperations.map(customOperationObject => {
      return {
        handler: _ => customBulkAction(selectedInstances, customOperationObject.handler),
        ui: customOperationObject.ui({ instances: selectedInstances }),
        disabled: selectedInstances.length === 0,
      }
    }),
  }
});

export default connect(
  /* istanbul ignore next */
  (storeState, { modelDefinition, externalOperations, customBulkOperations, uiConfig }) => ({
    viewModelData: getViewModelData(storeState, modelDefinition),
    defaultNewInstance: getDefaultNewInstance(storeState, modelDefinition),
    viewState: getViewState(storeState, modelDefinition),
    permissions: modelDefinition.permissions,
    customOperations: modelDefinition.ui.customOperations,
    externalOperations,
    customBulkOperations,
    uiConfig
  }),
  {
    deleteInstances,
    customBulkAction,
    resetFormFilter,
    searchInstances,
    toggleSelected,
    toggleSelectedAll,
    updateFormFilter,
    updateGotoPage,
    softRedirectView,
    toggleSearchForm
  },
  mergeProps
)(
  /* istanbul ignore next */
  ({ viewModel }) => <Main model={viewModel} />
);
