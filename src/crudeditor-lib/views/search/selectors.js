export const
  getResultFilter = ({ resultFilter }) => resultFilter,

  getSortField = ({ sortParams: { field } }) => field,

  getSortOrder = ({ sortParams: { order } }) => order,

  getPageMax = ({ pageParams: { max } }) => max,

  getPageOffset = ({ pageParams: { offset } }) => offset;
