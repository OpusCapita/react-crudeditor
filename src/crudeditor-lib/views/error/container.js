import React from 'react';
import { connect } from 'react-redux';

import Main from '../../../components/ErrorMain';
import { getViewModelData } from './selectors';
import { softRedirectView } from '../../common/actions';
import { VIEW_SEARCH } from '../../common/constants';

const mergeProps = ({
  viewModelData,
  permissions: {
    crudOperations
  },
  uiConfig
},
{
  goHome,
  ...dispatchProps
},
ownProps
) => ({
  ...ownProps,
  viewModel: {
    data: viewModelData,
    actions: {
      ...(crudOperations.view && { goHome }),
      ...dispatchProps
    },
    uiConfig
  },
});

export default connect(
  (storeState, { modelDefinition, uiConfig }) => ({
    viewModelData: getViewModelData(storeState, modelDefinition),
    permissions: modelDefinition.permissions,
    uiConfig
  }),
  {
    goHome: _ => softRedirectView({
      name: VIEW_SEARCH
    })
  },
  mergeProps
)(
  ({ viewModel }) => <Main model={viewModel} />
);
