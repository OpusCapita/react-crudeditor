import { VIEW_NAME } from './constants';

const DEFAULT_FIELD_TYPE = 'string';
const getFieldType = ({ type }) => return type || DEFAULT_FIELD_TYPE;

const AUDITABLE_FIELDS = [
  'createdBy',
  'changedBy',
  'createdOn',
  'changedOn'
];

const wrapper = f => ({
  views: {
    [VIEW_NAME]: view
  }
}, entityConfiguration) => f(view, entityConfiguration);

export const

  // █████████████████████████████████████████████████████████████████████████████████████████████████████████

  getEntityName = wrapper((_, {
    model: { name }
  }) => name),

  // █████████████████████████████████████████████████████████████████████████████████████████████████████████

  getResultFilter = wrapper(({ resultFilter }) => resultFilter),

  // █████████████████████████████████████████████████████████████████████████████████████████████████████████

  getFormFilter = wrapper(({ formFilter }) => formFilter),

  // █████████████████████████████████████████████████████████████████████████████████████████████████████████

  getSortField = wrapper(({
    sortParams: {
      field
    }
  }) => field),

  // █████████████████████████████████████████████████████████████████████████████████████████████████████████

  getSortOrder = wrapper(({
    sortParams: {
      order
    }
  }) => order),

  // █████████████████████████████████████████████████████████████████████████████████████████████████████████

  getPageMax = wrapper(({
    pageParams: {
      max
    }
  }) => max),

  // █████████████████████████████████████████████████████████████████████████████████████████████████████████

  getPageOffset = wrapper(({
    pageParams: {
      offset
    }
  }) => offset),

  // █████████████████████████████████████████████████████████████████████████████████████████████████████████

  getSearchableFields = wrapper((_, {
      model: {
        fields
      },
      ui
  }) => ui && ui.search && ui.search().searchableFields || Object.keys(fields).
    filter(name => !AUDITABLE_FIELDS.includes(name)).
    map(name => ({
      name,
      type: getFieldType(fields[name])
    }))),

  // █████████████████████████████████████████████████████████████████████████████████████████████████████████

  getResultFields = wrapper((_, {
      model: {
        fields
      },
      ui
  }) => ui && ui.search && ui.search().resultFields || Object.keys(fields).map(name => ({
    name,
    type: getFieldType(fields[name])
  }))),

  // █████████████████████████████████████████████████████████████████████████████████████████████████████████

  getTotalCount = wrapper(({ totalCount }) => totalCount),

  // █████████████████████████████████████████████████████████████████████████████████████████████████████████

  getResultInstances = wrapper(({ resultInstances }) => resultInstances),

  // █████████████████████████████████████████████████████████████████████████████████████████████████████████

  getSelectedInstances = wrapper(({ selectedInstances }) => selectedInstances),

  getIdField = wrapper((_, {
    model: { idField }
  }) => idField);
