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

const mapStateToProps = {
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
};

const mapDispatchToProps = {
  createInstance,
  deleteInstances,
  editInstance,
  resetFormFilter,
  searchInstances,
  toggleSelected,
  toggleSelectedAll,
  updateFormFilter
};

// XXX: the container MUST NOT receive any props with the same names as ones from the model =>
// the container MUST NOT receive any props at all because there is no guarantee that the same property
// never appears in the model.
export default connect(mapStateToProps, mapDispatchToProps)(({
  children,
  ...props
}) => {
  const model = [...Object.keys(mapStateToProps), ...Object.keys(mapDispatchToProps)].reduce(
    (rez, propName) => {
      rez[propName] = props[propName];
      delete props[propName];
      return rez;
    },
    {}
  );

  return <Main {...props} model={model}>{children}</Main>;
});
