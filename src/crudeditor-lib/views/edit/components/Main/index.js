import React from 'react';

import connect from '../../../../connect';
import { getPersistentInstance } from '../../selectors';

const EditView = ({ instance }) =>
  <div>
    {
      JSON.stringify(instance)
    }
  </div>;

export default connect({
  instance: getPersistentInstance
})(EditView);
