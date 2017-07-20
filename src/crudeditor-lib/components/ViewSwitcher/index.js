import React from 'react';
import connect from '../../connect';

import { Component as SearchView } from '../../views/search';
import { Component as CreateView } from '../../views/create';
import { Component as EditView } from '../../views/edit';
//import { Component as ShowView } from '../../views/show';
import { Component as ErrorView } from '../../views/error';

import {
  selectors as commonSelectors,
  constants as commonConstants
} from '../../common';

const { getActiveView } = commonSelectors;

const {
  VIEW_SEARCH,
  VIEW_CREATE,
  VIEW_EDIT,
  VIEW_SHOW,
  VIEW_ERROR
} = commonConstants;

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
