import React from 'react';

import connect from '../../../../connect';
import { getTotalCount } from '../../selectors';

export default connect({
  totalCount: getTotalCount
})(({ totalCount, children }) => totalCount > 0 ?
  <div>
    {children}
  </div> :
  <div className="bs-callout bs-callout-info">
    <span>0 items found</span>
  </div>
);
