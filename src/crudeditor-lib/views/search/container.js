import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Main from '../../../components/SearchMain';
import { VIEW_NAME } from './constants';
import { VIEW_EDIT, VIEW_SHOW, VIEW_CREATE } from '../../common/constants';
import { viewOperations } from '../lib';

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
  toggleSearchForm
} from './actions';

class SearchContainer extends PureComponent {
  static propTypes = {
    model: PropTypes.shape({
      actions: PropTypes.objectOf(PropTypes.func).isRequired,
      data: PropTypes.object.isRequired
    }).isRequired,
    uiConfig: PropTypes.object.isRequired
  }

  constructor(...args) {
    super(...args);

    const {
      model: {
        data: { hideSearchForm },
        actions: { toggleSearchForm }
      },
      uiConfig
    } = this.props;

    if (typeof hideSearchForm !== 'boolean') {
      toggleSearchForm(uiConfig.hideSearchForm);
    }
  }

  componentWillReceiveProps({
    uiConfig: { hideSearchForm }
  }) {
    if (hideSearchForm !== this.props.uiConfig.hideSearchForm) {
      this.props.model.actions.toggleSearchForm(hideSearchForm);
    }
  }

  render() {
    return <Main model={this.props.model} />;
  }
}

const mergeProps = /* istanbul ignore next */ (
  {
    defaultNewInstance,
    viewModelData,
    viewState,
    operations,
    permissions: { crudOperations },
    externalOperations,
    uiConfig
  },
  {
    softRedirectView,
    deleteInstances,
    ...dispatchProps
  },
  ownProps
) => ({
  ...ownProps,
  model: {
    data: {
      ...viewModelData,
      headerLevel: uiConfig.headerLevel
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
      }),
      ...(crudOperations.edit ? {
        editInstance: ({ instance, tab, offset }) => softRedirectView({
          name: VIEW_EDIT,
          state: { instance, tab },
          offset
        })
      } : {
        showInstance: ({ instance, tab, offset }) => softRedirectView({
          name: VIEW_SHOW,
          state: { instance, tab },
          offset
        })
      }),
      ...(crudOperations.delete && { deleteInstances }
      )
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
  },
  uiConfig
});

export default connect(
  /* istanbul ignore next */
  (storeState, { modelDefinition, externalOperations, uiConfig }) => ({
    viewModelData: getViewModelData(storeState, modelDefinition),
    defaultNewInstance: getDefaultNewInstance(storeState, modelDefinition),
    viewState: getViewState(storeState, modelDefinition),
    operations: modelDefinition.ui.operations,
    permissions: modelDefinition.permissions,
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
    softRedirectView,
    toggleSearchForm
  },
  mergeProps
)(SearchContainer);
