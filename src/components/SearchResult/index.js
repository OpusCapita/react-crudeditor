import React from 'react';

export default ({ totalCount, children }) => totalCount > 0 ?
  <div>
    {children}
  </div> :
  <div className="bs-callout bs-callout-info">
    <span>0 items found</span>
  </div>;
