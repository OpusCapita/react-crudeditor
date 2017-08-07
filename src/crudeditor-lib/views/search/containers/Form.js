import connect from '../../../connect';
import Form from '../../../../components/SearchForm';

import {
  searchInstances,
  resetFormFilter,
  updateFormFilter
} from '../actions';

import {
  getDefaultNewInstance,
  getResultFilter,
  getFormFilter,
  getSearchableFields
} from '../selectors';

import { createInstance } from '../../create/actions';

export default connect({
  defaultNewInstance: getDefaultNewInstance,
  resultFilter: getResultFilter,
  formFilter: getFormFilter,
  fields: getSearchableFields
}, {
  searchInstances,
  resetFormFilter,
  updateFormFilter,
  createInstance
})(Form);
