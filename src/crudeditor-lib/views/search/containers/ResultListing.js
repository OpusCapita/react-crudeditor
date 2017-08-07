// TODO: add operations (external, custom, ...) handlers.

import connect from '../../../connect';
import ResultListing from '../../../../components/SearchResultListing';
import { editInstance } from '../../edit/actions';
import { getLogicalIdBuilder } from '../../../common/selectors';

import {
  getSortField,
  getSortOrder,
  getResultInstances,
  getSelectedInstances,
  getResultFields
} from '../selectors';

import {
  deleteInstances,
  searchInstances,
  toggleSelected,
  toggleSelectedAll
} from '../actions';

export default connect({
  sortField: getSortField,
  sortOrder: getSortOrder,
  instances: getResultInstances,
  selectedInstances: getSelectedInstances,
  fields: getResultFields,
  logicalIdBuilder: getLogicalIdBuilder
}, {
  editInstance,
  deleteInstances,
  toggleSelected,
  toggleSelectedAll,
  searchInstances
})(ResultListing);
