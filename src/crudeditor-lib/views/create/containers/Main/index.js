import React from 'react';

import connect from '../../../../connect';
import { getEntityName } from '../../../../common/selectors';

const CreateView = ({ entityName }) =>
  <div>
    <h1>
      Create {entityName}
    </h1>
  </div>;

export default connect({
  entityName: getEntityName
})(CreateView);
