import React from 'react';
import connect from '../../connect';
import DefaultSearchResultListing from '../SearchResultListing';
import DefaultBulkOperationsPanel from '../BulkOperationsPanel';
import DefaultPaginationPanel from '../PaginationPanel';
import { VIEW_NAME_SEARCH } from '../../constants';

const SearchResult = ({ SearchResultListing, BulkOperationsPanel, PaginationPanel, totalCount }) =>
  totalCount > 0 ?
    <div>
      {
        SearchResultListing ? <SearchResultListing /> : <DefaultSearchResultListing />
      }
      {
        BulkOperationsPanel ? <BulkOperationsPanel /> : <DefaultBulkOperationsPanel />
      }
      {
        PaginationPanel ? <PaginationPanel /> : <DefaultPaginationPanel />
      }
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
    },
    metaData: {
      search: {
        result: {
          listing,
          pagination,
          bulkOperations
        }
      }
    }
  }) => ({
    totalCount,
    SearchResultListing: listing && listing.Component,
    BulkOperationsPanel: bulkOperations && bulkOperations.Component,
    PaginationPanel: pagination && pagination.Component
  }))({ state, metaData }),
)(SearchResult);
