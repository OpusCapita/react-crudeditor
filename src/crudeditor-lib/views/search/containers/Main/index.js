import React from 'react';

import connect from '../../../../connect';
import Form from '../Form';
import Result from '../Result';
import ResultListing from '../ResultListing';
import BulkOperationsPanel from '../BulkOperationsPanel';
import PaginationPanel from '../PaginationPanel';
import { getEntityName } from '../../../../common/selectors';

const SearchView = ({ entityName }) =>
  <div>
    <h1>Search {entityName}</h1>
    <Form />
    <Result>
      <ResultListing />
      <BulkOperationsPanel />
      <PaginationPanel />
    </Result>
  </div>;

export default connect({
  entityName: getEntityName
})(SearchView);
