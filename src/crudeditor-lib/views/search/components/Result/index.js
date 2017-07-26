import React from 'react';

import ResultListing from '../ResultListing';
import BulkOperationsPanel from '../BulkOperationsPanel';
import PaginationPanel from '../PaginationPanel';

import connect from '../../../../connect';
import { getTotalCount } from '../../selectors';

export default connect({
  totalCount: getTotalCount
})(({ totalCount }) => totalCount > 0 ?
  <div>
      <ResultListing />
      <BulkOperationsPanel />
      <PaginationPanel />
  </div> :
  <div className="bs-callout bs-callout-info">
    <span>0 items found</span>
  </div>
);
