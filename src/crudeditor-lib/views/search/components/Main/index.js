import React from 'react';

import connect from '../../../../connect';
import SearchForm from '../SearchForm';
import SearchResult from '../SearchResult';
import { selectors as commonSelectors } from '../../../../common';

const { getEntityName } = commonSelectors;

const SearchView = ({ entityName }) =>
  <div>
    <h1>Search {entityName}</h1>
    <SearchForm />
    <SearchResult />
  </div>;

export default connect({
  entityName: getEntityName
})(SearchView);
