import connect from '../../../connect';
import Field from '../../../../components/EditField';

import {
  getErrors,
  getFieldsMeta,
  getFormInstance
} from '../selectors';

import {
  validateInstanceField,
  changeInstanceField
} from '../actions';

export default connect({
  fieldsErrors: getErrors,
  fieldsMeta: getFieldsMeta,
  instance: getFormInstance
}, {
  validateInstanceField,
  changeInstanceField
})(Field);
