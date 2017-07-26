import React from 'react';

import connect from '../../../../connect';
import { selectors as commonSelectors } from '../../../../common';

const { getEntityName } = commonSelectors;

export default connect({
  entityName: getEntityName
})(({ entityName }) =>
  <div>
    <h1>
      Create {entityName}
    </h1>
  </div>
);
