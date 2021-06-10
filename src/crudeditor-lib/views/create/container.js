import React from 'react';
import { connect } from 'react-redux';
import Main from '../../../components/CreateMain';
import { softRedirectView } from '../../common/actions';
import { expandExternalOperation, expandCustomOperation } from '../lib';
import { VIEW_NAME } from './constants';
import { VIEW_SEARCH, PERMISSION_VIEW } from '../../common/constants';
import { isAllowed } from '../../lib';
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
    viewModelData: {
      unsavedChanges,
      ...restData
    },
    viewState,
    permissions: { crudOperations },
    customOperations,
    externalOperations,
    uiConfig
  },
  {
    softRedirectView,
    exitView,
    saveInstance,
    saveAndNewInstance,
    ...dispatchProps
  },
  { i18n }
) => ({
  viewModel: {
    uiConfig,

    data: {
      unsavedChanges,
      ...restData
    },

    actions: {
      ...dispatchProps,
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
        ...customOperations().map(expandCustomOperation({
          viewName: VIEW_NAME,
          viewState,
          softRedirectView
        })),
        ...externalOperations().map(expandExternalOperation({
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
      {
        title: i18n.getMessage('common.CrudEditor.saveAndNew.button'),
        disabled: !unsavedChanges,
        handler: saveAndNewInstance
      },
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
    viewState: getViewState(storeState, modelDefinition),
    permissions: modelDefinition.permissions,
    customOperations: modelDefinition.ui.customOperations,
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
