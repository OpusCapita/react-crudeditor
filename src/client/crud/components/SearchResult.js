import React from 'react';

export default function(props) {
  const {totalCount, listResult, bulkOperationsPanel, paginationPanel} = props;

  if (totalCount > 0) {
    return (
      <div>
        {listResult}

        {bulkOperationsPanel}

        {paginationPanel}
      </div>
    );
  } else {
    return (
      <div className="bs-callout bs-callout-info">
        <span>0 item(s) found</span>
      </div>
    );
  }
}