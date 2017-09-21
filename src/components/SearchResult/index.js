import React from 'react';

import ResultListing from '../SearchResultListing';
import BulkOperationsPanel from '../SearchBulkOperationsPanel';
import PaginationPanel from '../SearchPaginationPanel';
import './SearchResult.less';

export default ({ model }) => model.data.totalCount > 0 ? (
  <div className="crud--search-result">
    <div className="crud--search-result__table">
      <ResultListing model={model} />
    </div>
    <div className="crud--search-result__footer">
      <BulkOperationsPanel model={model} />
      <PaginationPanel model={model} />
    </div>
  </div>
) : (
  <div className="bs-callout bs-callout-info">
    <span>0 items found</span>
  </div>
);
