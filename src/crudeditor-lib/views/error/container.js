import React from 'react';
import { connect } from 'react-redux';
import Main from '../../../components/ErrorMain';
import { getViewModelData } from './selectors';
import { softRedirectView } from '../../common/actions';
import { VIEW_SEARCH, PERMISSION_VIEW } from '../../common/constants';
import { isAllowed } from '../../lib';

const mergeProps = /* istanbul ignore next */ (
  {
    viewModelData,
    permissions: {
      crudOperations
    },
    uiConfig
  },
  {
    goHome,
    ...dispatchProps
  }
) => ({
  viewModel: {
    uiConfig,
    data: viewModelData,
    actions: {
      ...(isAllowed(crudOperations, PERMISSION_VIEW) && { goHome }),
      ...dispatchProps
    }
  }
});

export default connect(
  /* istanbul ignore next */
  (storeState, { modelDefinition, uiConfig }) => ({
    viewModelData: getViewModelData(storeState, modelDefinition),
    permissions: modelDefinition.permissions,
    uiConfig
  }),
  {
    goHome: /* istanbul ignore next */ _ => softRedirectView({
      name: VIEW_SEARCH
    })
  },
  mergeProps
)(
  /* istanbul ignore next */
  ({ viewModel }) => <Main model={viewModel} />
);
