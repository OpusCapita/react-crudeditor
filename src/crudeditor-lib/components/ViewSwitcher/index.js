import React from 'react';
import connect from '../../connect';

import { getActiveView } from '../../common/selectors';

import SearchView from '../../views/search/components/Main';
import CreateView from '../../views/create/components/Main';
import EditView from '../../views/edit/components/Main';
//import ShowView from '../../views/show/components/Main';
import ErrorView from '../../views/error/components/Main';

import {
  VIEW_SEARCH,
  VIEW_CREATE,
  VIEW_EDIT,
  VIEW_SHOW,
  VIEW_ERROR
} from '../../common/constants';

const ViewSwitcher = ({ activeView }) => {
  if (!activeView) {
    return null;
  }

  switch (activeView) {
    case VIEW_SEARCH:
      return <SearchView />;
    case VIEW_CREATE:
      return <CreateView />;
    case VIEW_EDIT:
      return <EditView />;
    case VIEW_ERROR:
      return <ErrorView />;
    default:
      return <div>Unknown view <i>{activeView}</i></div>;
  }
};

export default connect({
  activeView: getActiveView
})(ViewSwitcher);
