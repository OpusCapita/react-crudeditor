import React from 'react';
import { connect } from 'react-redux';

import SearchView from '../../views/search';
import CreateView from '../../views/create/containers/Main';
import EditView from '../../views/edit';
//import ShowView from '../../views/show/containers/Main';
import ErrorView from '../../views/error/containers/Main';

import {
  VIEW_SEARCH,
  VIEW_CREATE,
  VIEW_EDIT,
  VIEW_SHOW,
  VIEW_ERROR
} from '../../common/constants';

const ViewSwitcher = ({
  activeViewName,
  entityConfiguration
}) => {
  if (!activeViewName) {
    return null;
  }

  switch (activeViewName) {
    case VIEW_SEARCH:
      return <SearchView entityConfiguration={entityConfiguration}/>;
    case VIEW_CREATE:
      return <CreateView entityConfiguration={entityConfiguration}/>;
    case VIEW_EDIT:
      return <EditView entityConfiguration={entityConfiguration}/>;
    case VIEW_ERROR:
      return <ErrorView entityConfiguration={entityConfiguration}/>;
    default:
      return <div>Unknown view <i>{activeViewName}</i></div>;
  }
};

export default connect(
  storeState => ({ activeViewName: storeState.common.activeViewName })
)(ViewSwitcher);
