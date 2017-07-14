import React from 'react';

import SearchResultListing from '../SearchResultListing';
import BulkOperationsPanel from '../BulkOperationsPanel';
import PaginationPanel from '../PaginationPanel';

import connect from '../../../../connect';
import { getTotalCount } from '../../selectors';

const SearchResult = ({ totalCount }) =>
  totalCount > 0 ?
    <div>
        <SearchResultListing />
        <BulkOperationsPanel />
        <PaginationPanel />
    </div> :
    <div className="bs-callout bs-callout-info">
      <span>0 items found</span>
    </div>;

export default connect({
  totalCount: getTotalCount
})(SearchResult);
