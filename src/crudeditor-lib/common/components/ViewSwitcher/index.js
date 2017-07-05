import React from 'react';
import connect from '../../connect';
import DefaultSearchView from '../SearchView';
import DefaultEditView from '../EditView';

import {
  VIEW_NAME_SEARCH,
  VIEW_NAME_CREATE,
  VIEW_NAME_EDIT
} from '../../constants';

const ViewSwitcher = ({ activeView, isInitialized, EditView, SearchView }) => {
  if (!isInitialized) {
    return null;
  }

  switch (activeView) {
    case VIEW_NAME_SEARCH:
      return SearchView ? <SearchView /> : <DefaultSearchView />;
    case VIEW_NAME_CREATE:
    case VIEW_NAME_EDIT:
      return EditView ? <EditView mode={activeView} /> : <DefaultEditView mode={activeView} />;
    default:
      return <div>Unknown view <i>{activeView}</i></div>;
  }
};

export default connect(
  (state, metaData) => (({
    state: {
      general: {
        exposable: {
          activeView
        },
        service: {
          isInitialized
        }
      }
    },
    metaData: {
      search: {
        Component: SearchView
      },
      edit: {
        Component: EditView
      }
    }
  }) => ({
    activeView,
    isInitialized,
    EditView,
    SearchView,
  }))({ state, metaData })
)(ViewSwitcher);
