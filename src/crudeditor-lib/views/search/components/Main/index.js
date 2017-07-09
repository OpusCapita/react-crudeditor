import React from 'react';

import connect from '../../../../connect';
import SearchForm from '../SearchForm';
import SearchResult from '../SearchResult';
import { getEntityName } from '../../selectors';

const SearchView = ({ entityName }) =>
  <div>
    <h1>Search {entityName}</h1>
    <SearchForm />
    <SearchResult />
  </div>;

export default connect({
  entityName: getEntityName
})(SearchView);
