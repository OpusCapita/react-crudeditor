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

import { checkErrorsObjects } from './lib';
import withAlerts from '../WithAlertsHOC';

const ViewSwitcher = ({ activeViewName, modelDefinition }) => {
  if (!activeViewName) {
    return null;
  }

  const ViewComponent = ({
    [VIEW_SEARCH]: SearchView,
    [VIEW_CREATE]: CreateView,
    [VIEW_EDIT]: EditView,
    [VIEW_SHOW]: ShowView,
    [VIEW_ERROR]: ErrorView
  })[activeViewName];

  return (<div>
    {
      ViewComponent ?
        <ViewComponent modelDefinition={modelDefinition} /> :
        <div>Unknown view <i>{activeViewName}</i></div>
    }
  </div>);
};

ViewSwitcher.propTypes = {
  activeViewName: PropTypes.string,
  modelDefinition: PropTypes.object
}

// FIXME: remove connect as unnecessary.
export default connect(
  storeState => {
    // check for proper 'errors' objects in views
    const views = [VIEW_CREATE, VIEW_EDIT, VIEW_SEARCH, VIEW_SHOW];

    checkErrorsObjects(storeState, views);

    const activeViewName = storeState.common.activeViewName;

    // FIXME: remove flags since they are never used in children.
    const { flags, errors: { general, fields = {} } } = storeState.views[activeViewName];

    return {
      activeViewName,
      errors: {
        general,
        fields
      },
      flags
    }
  }
)(withAlerts(ViewSwitcher));
