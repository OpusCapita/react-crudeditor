import { VIEW_NAME } from './constants';

export const
  getEntityName = ({
    entityConfiguration: {
      model: {
        name
      }
    }
  }) => name,

  getResultFilter = ({ resultFilter }) => resultFilter,

  getFormFilter = ({ formFilter }) => formFilter,

  getSortField = ({
    sortParams: {
      field
    }
  }) => field,

  getSortOrder = ({
    sortParams: {
      order
    }
  }) => order,

  getPageMax = ({
    pageParams: {
      max
    }
  }) => max,

  getPageOffset = ({
    pageParams: {
      offset
    }
  }) => offset,

  getSearchableFields => ({
    entityConfiguration: {
      model: {
        fields
      },
      ui
    }
  }) => ui && ui.search && ui.search().searchableFields || Object.keys(fields).map(name => ({
    name,
    type: fields[name].type || 'string'
  }));
