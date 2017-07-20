import React from 'react';

import connect from '../../../../connect';
import { selectors as commonSelectors } from '../../../../common';

import {
  getInstance,
  getInstanceDescription
} from '../../selectors';

const { getEntityName } = commonSelectors;

const CreateView = ({ entityName, instance, instanceDescription }) =>
  <div>
    <h1>
      Create {entityName}
      {
        instanceDescription ?
          <small>{instanceDescription}</small> :
          null
      }
    </h1>
    <br />
    {
      JSON.stringify(instance)
    }
  </div>;

export default connect({
  entityName: getEntityName,
  instance: getInstance,
  instanceDescription: getInstanceDescription
})(CreateView);
