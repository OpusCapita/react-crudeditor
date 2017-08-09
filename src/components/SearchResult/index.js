import React from 'react';

import ResultListing from '../SearchResultListing';
import BulkOperationsPanel from '../SearchBulkOperationsPanel';
import PaginationPanel from '../SearchPaginationPanel';

export default ({ model }) => model.data.totalCount > 0 ?
  <div>
    <ResultListing model={model} />
    <BulkOperationsPanel model={model} />
    <PaginationPanel model={model} />
  </div> :
  <div className="bs-callout bs-callout-info">
    <span>0 items found</span>
  </div>;
