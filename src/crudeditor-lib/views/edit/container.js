import React from 'react';
import { connect } from 'react-redux';

import Main from '../../../components/EditMain';
import { VIEW_NAME } from './constants';
import { VIEW_SEARCH, PERMISSION_VIEW, PERMISSION_CREATE, PERMISSION_DELETE } from '../../common/constants';
import { expandExternalOperation, expandCustomOperation } from '../lib';
import { getTotalCount } from '../search/selectors';
import { isAllowed } from '../../lib';

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
      ...(isAllowed(crudOperations, PERMISSION_VIEW) && { exitView })
    },

    /*
     * Operations requiering confirmation in case of unsaved changes
     * are supplied with "confirm" property containing an object with translation texts for Confirm Dialog.
     *
     * "show" property is removed from each custom/external operation
     * since operations with "show" set to "false" are not included in the result array.
     */
    operations: viewState ? [
      ...(isAllowed(crudOperations, PERMISSION_VIEW) && [{
        title: i18n.getMessage('common.CrudEditor.cancel.button'),
        handler: exitView,
        style: 'link',
        ...(!!unsavedChanges && {
          confirm: {
            message: i18n.getMessage('common.CrudEditor.unsaved.confirmation'),
            textConfirm: i18n.getMessage('common.CrudEditor.confirm.action'),
            textCancel: i18n.getMessage('common.CrudEditor.cancel.button')
          }
        })
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
        filter(operation => operation).
        map(operation => unsavedChanges ?
          ({
            ...operation,
            confirm: {
              message: i18n.getMessage('common.CrudEditor.unsaved.confirmation'),
              textConfirm: i18n.getMessage('common.CrudEditor.confirm.action'),
              textCancel: i18n.getMessage('common.CrudEditor.cancel.button')
            }
          }) :
          operation
        ),
      ...(isAllowed(crudOperations, PERMISSION_DELETE, { instance }) && [{
        title: i18n.getMessage('common.CrudEditor.delete.button'),
        icon: 'trash',
        handler: _ => deleteInstances(instance),
        confirm: {
          message: i18n.getMessage('common.CrudEditor.delete.confirmation'),
          textConfirm: i18n.getMessage('common.CrudEditor.delete.button'),
          textCancel: i18n.getMessage('common.CrudEditor.cancel.button')
        }
      }]),
      ...(isAllowed(crudOperations, PERMISSION_CREATE) && [{
        title: i18n.getMessage('common.CrudEditor.saveAndNew.button'),
        disabled: !unsavedChanges,
        handler: saveAndNewInstance
      }]),
      ...(!!adjacentInstancesExist.next && [{
        title: i18n.getMessage('common.CrudEditor.saveAndNext.button'),
        disabled: !unsavedChanges,
        handler: saveAndNextInstance
      }]),
      {
        title: i18n.getMessage('common.CrudEditor.save.button'),
        disabled: !unsavedChanges,
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
