import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import SearchView from '../../views/search/container';
import CreateView from '../../views/create/container';
import EditView from '../../views/edit/container';
import ShowView from '../../views/show/container';
import ErrorView from '../../views/error/container';

import {
  VIEW_SEARCH,
  VIEW_CREATE,
  VIEW_EDIT,
  VIEW_SHOW,
  VIEW_ERROR
} from '../../common/constants';

import WithAlerts from '../WithAlertsHOC';

const ViewSwitcher = ({ activeViewName, modelDefinition, externalOperations, customBulkOperations, uiConfig }, { i18n }) => {
  if (!activeViewName) {
    return null;
  }

  const ViewContainer = ({
    [VIEW_SEARCH]: SearchView,
    [VIEW_CREATE]: CreateView,
    [VIEW_EDIT]: EditView,
    [VIEW_SHOW]: ShowView,
    [VIEW_ERROR]: ErrorView
  })[activeViewName];

  return (
    <div>
      {
        ViewContainer ?
          <ViewContainer
            modelDefinition={modelDefinition}
            externalOperations={externalOperations}
            customBulkOperations={customBulkOperations}
            uiConfig={uiConfig}
            i18n={i18n}
          /> :
          <div>Unknown view <i>{activeViewName}</i></div>
      }
    </div>
  );
}

ViewSwitcher.propTypes = {
  activeViewName: PropTypes.string,
  modelDefinition: PropTypes.object.isRequired,
  externalOperations: PropTypes.func.isRequired,
  customBulkOperations: PropTypes.array.isRequired,
  uiConfig: PropTypes.object.isRequired
};

ViewSwitcher.contextTypes = {
  i18n: PropTypes.object
};

export default connect(
  storeState => ({ activeViewName: storeState.common.activeViewName })
)(WithAlerts(ViewSwitcher));
