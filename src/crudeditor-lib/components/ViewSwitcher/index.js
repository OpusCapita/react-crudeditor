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

  return ViewComponent ?
    <ViewComponent modelDefinition={modelDefinition} /> :
    <div>Unknown view <i>{activeViewName}</i></div>;
};

ViewSwitcher.propTypes = {
  activeViewName: PropTypes.string,
  modelDefinition: PropTypes.object
}

export default connect(
  storeState => ({ activeViewName: storeState.common.activeViewName })
)(ViewSwitcher);
