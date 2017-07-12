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
      <span>0 item(s) found</span>
    </div>;

export default connect(
  (state, metaData) => (({
    state: {
      views: {
        [VIEW_NAME_SEARCH]: {
          control: {
            totalCount
          }
        }
      }
    }
  }) => ({
    totalCount
  }))({ state, metaData }),
)(SearchResult);
