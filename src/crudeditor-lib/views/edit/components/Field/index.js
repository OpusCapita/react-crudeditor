import React from 'react';

import Field from '../../../../components/CreateEditShow/Field';
import connect from '../../../../connect';

import {
  getErrors,
  getFieldsMeta,
  getFormInstance
} from '../../selectors';

import {
  validateInstanceField,
  changeInstanceField
} from '../../actions';

@connect({
  fieldsErrors: getErrors,
  fieldsMeta: getFieldsMeta,
  instance: getFormInstance
}, {
  validateInstanceField,
  changeInstanceField
})(Field);
