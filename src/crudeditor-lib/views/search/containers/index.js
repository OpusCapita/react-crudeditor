import React from 'react';

import connect from '../../../connect';
import Main from '../../../../components/SearchMain';

/*█████████████████*\
 *███ SELECTORS ███*
\*█████████████████*/

import {
  getEntityName,
  getLogicalIdBuilder
} from '../../../common/selectors';

import {
  getDefaultNewInstance,
  getFormFilter,
  getPageMax,
  getPageOffset,
  getResultFields,
  getResultFilter,
  getResultInstances,
  getSearchableFields,
  getSelectedInstances,
  getSortField,
  getSortOrder,
  getTotalCount
} from '../selectors';

/*███████████████*\
 *███ ACTIONS ███*
\*███████████████*/

import { createInstance } from '../../create/actions';
import { editInstance } from '../../edit/actions';

import {
  deleteInstances,
  resetFormFilter,
  searchInstances,
  toggleSelected,
  toggleSelectedAll,
  updateFormFilter
} from '../actions';

export default connect({
  defaultNewInstance: getDefaultNewInstance,
  entityName: getEntityName,
  formFilter: getFormFilter,
  logicalIdBuilder: getLogicalIdBuilder,
  max: getPageMax,
  offset: getPageOffset,
  resultFields: getResultFields,
  resultFilter: getResultFilter,
  resultInstances: getResultInstances,
  searchableFields: getSearchableFields,
  selectedInstances: getSelectedInstances,
  sortField: getSortField,
  sortOrder: getSortOrder,
  totalCount: getTotalCount
}, {
  createInstance,
  deleteInstances,
  editInstance,
  resetFormFilter,
  searchInstances,
  updateFormFilter
})(({
  defaultNewInstance,
  entityName,
  formFilter,
  logicalIdBuilder,
  max,
  offset,
  resultFields,
  resultFilter,
  resultInstances,
  searchableFields,
  selectedInstances,
  sortField,
  sortOrder,
  totalCount,

  createInstance,
  deleteInstances,
  editInstance,
  resetFormFilter,
  searchInstances,
  toggleSelected,
  toggleSelectedAll,
  updateFormFilter,

  children,
  ...props
}) =>
  <Main {...props} model={{
    defaultNewInstance,
    entityName,
    formFilter,
    logicalIdBuilder,
    max,
    offset,
    resultFields,
    resultFilter,
    resultInstances,
    searchableFields,
    selectedInstances,
    sortField,
    sortOrder,
    totalCount,

    createInstance,
    deleteInstances,
    editInstance,
    resetFormFilter,
    searchInstances,
    toggleSelected,
    toggleSelectedAll,
    updateFormFilter
  }}>{children}</Main>
);
