import React from 'react';
import { connect } from 'react-redux';

import Main from '../../../components/EditMain';
import { VIEW_NAME } from './constants';
import { VIEW_SEARCH } from '../../common/constants';
import { expandOperation } from '../lib';
import { getTotalCount } from '../search/selectors';

import {
  getViewModelData,
  getViewState,
  getAdjacentInstancesInfo
} from './selectors';

import {
  deleteInstances,
  softRedirectView
} from '../../common/actions';

import {
  changeInstanceField,
  saveInstance,
  saveAndNewInstance,
  saveAndNextInstance,
  selectTab,
  validateInstanceField,
  editPreviousInstance,
  editNextInstance
} from './actions';

const mergeProps = /* istanbul ignore next */ (
  {
    viewModelData: {
      persistentInstance: instance,
      unsavedChanges,
      ...restData
    },
    adjacentInstancesExist,
    viewState,
    permissions: { crudOperations },
    standardOperations,
    customOperations,
    externalOperations,
    uiConfig
  },
  {
    saveAndNextInstance,
    editPreviousInstance,
    editNextInstance,
    softRedirectView,
    deleteInstances,
    exitView,
    saveAndNewInstance,
    saveInstance,
    ...dispatchProps
  },
  { i18n }
) => ({
  viewModel: {
    uiConfig,

    data: {
      persistentInstance: instance,
      unsavedChanges,
      ...restData
    },

    actions: {
      ...dispatchProps,
      ...(adjacentInstancesExist.previous && { gotoPreviousInstance: editPreviousInstance }),
      ...(adjacentInstancesExist.next && { gotoNextInstance: editNextInstance }),
      ...(crudOperations.view && { exitView })
    },

    /*
     * Operations requiering confirmation in case of unsaved changes
     * are supplied with "confirm" property containing an object with translation texts for Confirm Dialog.
     *
     * "show" property is removed from each custom/external operation
     * since operations with "show" set to "false" are not included in the result array.
     */
    operations: viewState ? [
      ...(!!crudOperations.view && [{
        title: i18n.getMessage('crudEditor.cancel.button'),
        disabled: false,
        dropdown: false,
        handler: exitView,
        style: 'link',
        ...(!!unsavedChanges && {
          confirm: {
            message: i18n.getMessage('crudEditor.unsaved.confirmation'),
            textConfirm: i18n.getMessage('crudEditor.confirm.action'),
            textCancel: i18n.getMessage('crudEditor.cancel.button')
          }
        })
      }]),
      ...[...customOperations(instance), ...externalOperations(instance)].
        map(expandOperation({
          viewName: VIEW_NAME,
          viewState,
          softRedirectView
        })).
        filter(operation => operation).
        map(operation => unsavedChanges ?
          ({
            ...operation,
            confirm: {
              message: i18n.getMessage('crudEditor.unsaved.confirmation'),
              textConfirm: i18n.getMessage('crudEditor.confirm.action'),
              textCancel: i18n.getMessage('crudEditor.cancel.button')
            }
          }) :
          operation
        ),
      ...(!!crudOperations.delete && [{
        title: i18n.getMessage('crudEditor.delete.button'),
        icon: 'trash',
        disabled: standardOperations.delete && standardOperations.delete(instance).disabled,
        dropdown: false,
        handler: _ => deleteInstances(instance),
        confirm: {
          message: i18n.getMessage('crudEditor.delete.confirmation'),
          textConfirm: i18n.getMessage('crudEditor.delete.button'),
          textCancel: i18n.getMessage('crudEditor.cancel.button')
        }
      }]),
      ...(!!crudOperations.create && [{
        title: i18n.getMessage('crudEditor.saveAndNew.button'),
        disabled: !unsavedChanges,
        dropdown: false,
        handler: saveAndNewInstance
      }]),
      ...(!!adjacentInstancesExist.next && [{
        title: i18n.getMessage('crudEditor.saveAndNext.button'),
        disabled: !unsavedChanges,
        dropdown: false,
        handler: saveAndNextInstance
      }]),
      {
        title: i18n.getMessage('crudEditor.save.button'),
        disabled: !unsavedChanges,
        dropdown: false,
        handler: saveInstance,
        style: 'primary'
      }
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
      getTotalCount.bind(null, storeState) // binding to prevent the call without "view" crudPermissions.
    ),
    viewState: getViewState(storeState, modelDefinition),
    permissions: modelDefinition.permissions,
    standardOperations: modelDefinition.ui.edit.standardOperations,
    customOperations: modelDefinition.ui.customOperations,
    externalOperations,
    uiConfig
  }), {
    changeInstanceField,
    deleteInstances,
    exitView: /* istanbul ignore next */ _ => softRedirectView({ name: VIEW_SEARCH }),
    saveAndNewInstance,
    saveInstance,
    saveAndNextInstance,
    selectTab,
    validateInstanceField,
    editPreviousInstance,
    editNextInstance,
    softRedirectView
  },
  mergeProps
)(
  /* istanbul ignore next */
  ({ viewModel }) => <Main model={viewModel} />
);
