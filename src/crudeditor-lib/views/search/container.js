import React from 'react';
import { connect } from 'react-redux';

import Main from '../../../components/SearchMain';
import { VIEW_NAME } from './constants';
import { VIEW_EDIT, VIEW_SHOW, VIEW_CREATE } from '../../common/constants';
import { expandExternalOperation, expandCustomOperation } from '../lib';

import {
  deleteInstances,
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
    standardOperations,
    customOperations,
    externalOperations,
    uiConfig
  },
  {
    softRedirectView,
    deleteInstances,
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
      ...(crudOperations.create && {
        createInstance: _ => softRedirectView({
          name: VIEW_CREATE,
          state: {
            predefinedFields: defaultNewInstance
          }
        })
      })
    },

    permissions: {
      delete: (...instances) => crudOperations.delete && (
        instances.length === 0 || // return the user's global CRUD permission to delete.
        !instances.some( // return the user's permission to delete the instances.
          instance => standardOperations.delete && standardOperations.delete(instance).disabled
        )
      )
    },

    /*
     * Operations requiering confirmation
     * are supplied with "confirm" property containing an object with translation texts for Confirm Dialog.
     *
     * "show" property is removed from each custom/external operation
     * since operations with "show" set to "false" are not included in the result array.
     */
    instanceOperations: ({ instance, offset }) => viewState ? [
      {
        title: i18n.getMessage(`crudEditor.${ crudOperations.edit ? 'edit' : 'show' }.button`),
        icon: crudOperations.edit ? 'edit' : 'eye-open',
        handler: _ => softRedirectView({
          name: crudOperations.edit ? VIEW_EDIT : VIEW_SHOW,
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
      ...(crudOperations.delete && [{
        title: i18n.getMessage('crudEditor.delete.button'),
        icon: 'trash',
        disabled: standardOperations.delete && standardOperations.delete(instance).disabled,
        handler: _ => deleteInstances(instance),
        confirm: {
          message: i18n.getMessage('crudEditor.delete.confirmation'),
          textConfirm: i18n.getMessage('crudEditor.delete.button'),
          textCancel: i18n.getMessage('crudEditor.cancel.button')
        }
      }])
    ] :
      [], // viewState is undefined when view is not initialized yet (ex. during Hard Redirect).

    bulkOperations: viewState ? {
      delete: crudOperations.delete && {
        title: i18n.getMessage('crudEditor.deleteSelected.button'),
        disabled: selectedInstances.length === 0 || selectedInstances.some(
          instance => standardOperations.delete && standardOperations.delete(instance).disabled
        ),
        handler: _ => deleteInstances(selectedInstances),
        confirm: {
          message: i18n.getMessage('crudEditor.deleteSelected.confirmation'),
          textConfirm: i18n.getMessage('crudEditor.delete.button'),
          textCancel: i18n.getMessage('crudEditor.cancel.button')
        }
      }
    } :
      {} // viewState is undefined when view is not initialized yet (ex. during Hard Redirect).
  }
});

export default connect(
  /* istanbul ignore next */
  (storeState, { modelDefinition, externalOperations, uiConfig }) => ({
    viewModelData: getViewModelData(storeState, modelDefinition),
    defaultNewInstance: getDefaultNewInstance(storeState, modelDefinition),
    viewState: getViewState(storeState, modelDefinition),
    permissions: modelDefinition.permissions,
    standardOperations: modelDefinition.ui.search.standardOperations,
    customOperations: modelDefinition.ui.customOperations,
    externalOperations,
    uiConfig
  }),
  {
    deleteInstances,
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
