import React from 'react';

import connect from '../../../../connect';
import { selectors as commonSelectors } from '../../../../common';

const { getEntityName } = commonSelectors;

const CreateView = ({ entityName }) =>
  <div>
    <h1>
      Create {entityName}
    </h1>
  </div>;

export default connect({
  entityName: getEntityName
})(CreateView);
