import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import u from 'updeep';

import { getDefaultSortField } from './lib';
import { getLogicalKeyBuilder } from '../lib';

import {
  format as formatField,
  parse as parseField
} from '../../../data-types-lib';

import {
  DEFAULT_MAX,
  DEFAULT_OFFSET,
  DEFAULT_ORDER,

  ALL_INSTANCES_SELECT,
  ALL_INSTANCES_DESELECT,

  FORM_FILTER_PARSE,
  FORM_FILTER_RESET,
  FORM_FILTER_UPDATE,

  INSTANCES_SEARCH_FAIL,
  INSTANCES_SEARCH_REQUEST,
  INSTANCES_SEARCH_SUCCESS,

  INSTANCE_SELECT,
  INSTANCE_DESELECT,

  VIEW_INITIALIZE_REQUEST,
  VIEW_INITIALIZE_FAIL,
  VIEW_INITIALIZE_SUCCESS,

  VIEW_REDIRECT_REQUEST,
  VIEW_REDIRECT_FAIL,
  VIEW_REDIRECT_SUCCESS,
} from './constants';

import {
  STATUS_DELETING,
  STATUS_INITIALIZING,
  STATUS_READY,
  STATUS_REDIRECTING,
  STATUS_SEARCHING,
  STATUS_UNINITIALIZED,

  EMPTY_FIELD_VALUE,

  INSTANCES_DELETE_FAIL,
  INSTANCES_DELETE_REQUEST,
  INSTANCES_DELETE_SUCCESS,

  UNPARSABLE_FIELD_VALUE
} from '../../common/constants';

const isRangeValue = value => value &&
  typeof value === 'object' &&
  value.hasOwnProperty('from') &&
  value.hasOwnProperty('to') &&
  Object.keys(value).length === 2;

const getFieldValue = ({ filter, path }) => {
  const [fieldName, subFieldName] = Array.isArray(path) ? path : [path, null];

  return subFieldName && filter[fieldName] !== undefined ?
    filter[fieldName][subFieldName] :
    filter[fieldName];
};

/*
 * path is either string with field name or array with field name and sub-field name.
 * the function returns an object with field name as only key and appropriate field value.
 */
const setFieldValue = ({ isRange, path, value }) => {
  const [fieldName, subFieldName] = Array.isArray(path) ? path : [path, null];

  return {
    [fieldName]: subFieldName ? {
      [subFieldName]: value
    } : (
      !isRange || isRangeValue(value) ?
        value :
        // the field is range field but the value does not have range structure
        // => assign the same value to each sub-field.
        {
          from: cloneDeep(value),
          to: cloneDeep(value)
        }
    )
  };
};

const buildDefaultParsedFilter = searchableFields => searchableFields.reduce(
  (rez, {
    name: fieldName,
    render: { isRange }
  }) => ({
    ...rez,
    ...setFieldValue({
      isRange,
      path: fieldName,
      value: EMPTY_FIELD_VALUE
    })
  }),
  {}
);

const buildDefaultFormatedFilter = ({
  model: {
    fields: fieldsMeta
  },
  ui: {
    search: { searchableFields }
  }
}) => searchableFields.reduce(
  (rez, {
    name: fieldName,
    render: {
      isRange,
      valueProp: {
        type: targetType
      }
    }
  }) => ({
    ...rez,
    ...setFieldValue({
      isRange,
      path: fieldName,
      value: formatField({
        value: EMPTY_FIELD_VALUE,
        type: fieldsMeta[fieldName].type,
        targetType
      })
    })
  }),
  {}
);

const buildFormatedFilter = ({
  modelDefinition: {
    model: {
      fields: fieldsMeta
    },
    ui: {
      search: { searchableFields }
    }
  },
  filter
}) => Object.keys(filter).reduce(
  (rez, fieldName) => {
    const type = fieldsMeta[fieldName].type;
    let isRange, targetType;

    searchableFields.some(fieldMeta => {
      if (fieldMeta.name === fieldName) {
        isRange = fieldMeta.render.isRange;
        targetType = fieldMeta.render.valueProp.type;
        return true;
      }

      return false;
    });

    return {
      ...rez,
      ...setFieldValue({
        isRange,
        path: fieldName,
        value: isRange ? {
          from: formatField({ type, targetType, value: filter[fieldName].from }),
          to: formatField({ type, targetType, value: filter[fieldName].to }),
        } :
          formatField({ type, targetType, value: filter[fieldName] })
      })
    };
  },
  {}
);

export const buildDefaultStoreState = modelDefinition => ({

  // Active filter as displayed in Search Result.
  resultFilter: buildDefaultParsedFilter(modelDefinition.ui.search.searchableFields),

  // Raw filter as displayed in Search Criteria.
  formFilter: buildDefaultParsedFilter(modelDefinition.ui.search.searchableFields),

  // Raw filter as communicated to Search fields React Components.
  formatedFilter: buildDefaultFormatedFilter(modelDefinition),

  // Field name or array [fieldName, subFieldName] in case of range a user is entering =>
  // formatedFilter[fieldName] is up-to-date,
  // formFilter[fieldName] is obsolete and waits for been filled with parsed formatedFilter[fieldName]
  // (or UNPARSABLE_FIELD_VALUE if the value happens to be unparsable).
  divergedField: null,

  sortParams: {
    field: getDefaultSortField(modelDefinition.ui.search),
    order: DEFAULT_ORDER
  },
  pageParams: {
    max: DEFAULT_MAX,
    offset: DEFAULT_OFFSET
  },
  resultInstances: undefined, // XXX: must be undefined until first extraction.
  selectedInstances: [], // XXX: must be a sub-array of refs from resultInstances.
  totalCount: undefined,

  errors: {

    // object with keys as field names,
    // values as arrays of Parsing Errors, may not be empty
    // (the object does not have keys for successfully parsed values).
    fields: {},

    // Array of Internal Errors, may be empty.
    general: []
  },

  status: STATUS_UNINITIALIZED
});

/*
 * XXX:
 * Only objects and arrays are allowed at branch nodes.
 * Only primitive data types are allowed at leaf nodes.
 */
export default modelDefinition => {
  const buildLogicalKey = getLogicalKeyBuilder(modelDefinition.model.fields);

  // Remove benchmarkInstances from sourceInstances by comparing their Logical Keys.
  const removeInstances = (sourceInstances, benchmarkInstances) =>
    sourceInstances.filter(sourceInstance =>
      !benchmarkInstances.some(benchmarkInstance =>
        isEqual(
          buildLogicalKey(sourceInstance),
          buildLogicalKey(benchmarkInstance)
        )
      )
    );

  return (storeState = buildDefaultStoreState(modelDefinition), { type, payload, error, meta }) => {
    if (storeState.status === STATUS_UNINITIALIZED && type !== VIEW_INITIALIZE_REQUEST) {
      return storeState;
    }

    const newStoreStateSlice = {};

    // ███████████████████████████████████████████████████████████████████████████████████████████████████████████

    if (type === VIEW_INITIALIZE_REQUEST) {
      newStoreStateSlice.status = STATUS_INITIALIZING;
    } else if (type === VIEW_INITIALIZE_FAIL) {
      newStoreStateSlice.status = STATUS_UNINITIALIZED;
    } else if (type === VIEW_INITIALIZE_SUCCESS) {
      newStoreStateSlice.status = STATUS_READY;

    // ███████████████████████████████████████████████████████████████████████████████████████████████████████████
    } else if (type === VIEW_REDIRECT_REQUEST) {
      newStoreStateSlice.status = STATUS_REDIRECTING;
    } else if (type === VIEW_REDIRECT_FAIL) {
      const errors = Array.isArray(payload) ? payload : [payload];

      if (!isEqual(storeState.errors.general, errors)) {
        newStoreStateSlice.errors = {
          general: errors
        };
      }

      newStoreStateSlice.status = STATUS_READY;
    } else if (type === VIEW_REDIRECT_SUCCESS) {
      // Do not reset store to initial uninitialized state because
      // filter, order, sort, etc. must remain after returning from other Views.
      newStoreStateSlice.formFilter = u.constant(cloneDeep(storeState.resultFilter));
      newStoreStateSlice.divergedField = null;
      newStoreStateSlice.selectedInstances = [];

      newStoreStateSlice.formatedFilter = u.constant(buildFormatedFilter({
        modelDefinition,
        filter: storeState.resultFilter
      }));

      newStoreStateSlice.errors = u.constant({
        fields: {},
        general: []
      });

      newStoreStateSlice.status = STATUS_UNINITIALIZED;

    // ███████████████████████████████████████████████████████████████████████████████████████████████████████
    } else if (type === INSTANCES_DELETE_REQUEST) {
      newStoreStateSlice.status = STATUS_DELETING;
    } else if (type === INSTANCES_DELETE_SUCCESS) {
      const { instances } = payload;
      newStoreStateSlice.selectedInstances = removeInstances(storeState.selectedInstances, instances);
      newStoreStateSlice.resultInstances = removeInstances(storeState.resultInstances, instances);
      newStoreStateSlice.totalCount = storeState.totalCount - instances.length;

      if (storeState.errors.general.length) {
        newStoreStateSlice.errors = {
          general: []
        };
      }
      newStoreStateSlice.status = STATUS_READY;
    } else if (type === INSTANCES_DELETE_FAIL) {
      const errors = Array.isArray(payload) ? payload : [payload];

      if (!isEqual(storeState.errors.general, errors)) {
        newStoreStateSlice.errors = {
          general: errors
        };
      }

      newStoreStateSlice.status = STATUS_READY;

    // ███████████████████████████████████████████████████████████████████████████████████████████████████████████
    } else if (type === INSTANCES_SEARCH_REQUEST && storeState.status !== STATUS_INITIALIZING) {
      newStoreStateSlice.status = STATUS_SEARCHING;

    // ███████████████████████████████████████████████████████████████████████████████████████████████████████
    } else if (type === INSTANCES_SEARCH_SUCCESS) {
      const {
        filter,
        sort,
        order,
        max,
        offset,
        instances,
        totalCount
      } = payload;

      newStoreStateSlice.resultFilter = u.constant(cloneDeep(filter));
      newStoreStateSlice.formFilter = u.constant(cloneDeep(filter));
      newStoreStateSlice.divergedField = null;

      newStoreStateSlice.formatedFilter = u.constant(buildFormatedFilter({
        modelDefinition,
        filter
      }));

      newStoreStateSlice.sortParams = {
        field: sort,
        order
      };

      newStoreStateSlice.pageParams = {
        max,
        offset
      };

      newStoreStateSlice.totalCount = totalCount;

      // XXX: updeep-package does not check arrays for equality.
      if (!isEqual(instances, storeState.resultInstances)) {
        newStoreStateSlice.resultInstances = instances;
        newStoreStateSlice.selectedInstances = [];
      }

      if (storeState.status !== STATUS_INITIALIZING) {
        if (storeState.errors.general.length) {
          newStoreStateSlice.errors = {
            general: []
          };
        }

        newStoreStateSlice.status = STATUS_READY;
      }

    // ███████████████████████████████████████████████████████████████████████████████████████████████████████
    } else if (type === INSTANCES_SEARCH_FAIL && storeState.status !== STATUS_INITIALIZING) {
      const errors = Array.isArray(payload) ? payload : [payload];

      if (!isEqual(storeState.errors.general, errors)) {
        newStoreStateSlice.errors = {
          general: errors
        };
      }

      newStoreStateSlice.status = STATUS_READY;

    // ███████████████████████████████████████████████████████████████████████████████████████████████████████
    } else if (type === FORM_FILTER_RESET) {
      newStoreStateSlice.formatedFilter = u.constant(buildDefaultFormatedFilter(modelDefinition));
      newStoreStateSlice.formFilter = u.constant(buildDefaultParsedFilter(modelDefinition.ui.search.searchableFields));
      newStoreStateSlice.divergedField = null;

    // ███████████████████████████████████████████████████████████████████████████████████████████████████████
    } else if (type === FORM_FILTER_UPDATE) {
      const {
        path,
        value: fieldValue
      } = payload;

      const fieldName = Array.isArray(path) ? path[0] : path;

      newStoreStateSlice.formatedFilter = setFieldValue({
        isRange: modelDefinition.ui.search.searchableFields.some(
          ({
            name,
            render: { isRange }
          }) =>
            name === fieldName && isRange
        ),
        path,
        value: u.constant(fieldValue)
      });

      newStoreStateSlice.divergedField = path;

    // ███████████████████████████████████████████████████████████████████████████████████████████████████████
    } else if (type === FORM_FILTER_PARSE && storeState.divergedField) {
      // if storeState.divergedField is null, no data has changed.
      const { path } = payload;

      const fieldName = Array.isArray(path) ? path[0] : path;
      const fieldType = modelDefinition.model.fields[fieldName].type;
      let isRange, uiType;

      modelDefinition.ui.search.searchableFields.some(fieldMeta => {
        if (fieldMeta.name === fieldName) {
          isRange = fieldMeta.render.isRange;
          uiType = fieldMeta.render.valueProp.type;
          return true;
        }

        return false;
      });

      const oldFormValue = getFieldValue({
        filter: storeState.formFilter,
        path
      });

      const oldFormatedValue = getFieldValue({
        filter: storeState.formatedFilter,
        path
      });

      const oldErrorValue = getFieldValue({
        filter: storeState.errors,
        path
      });

      PARSE_LABEL: {
        let newFormValue;

        try {
          newFormValue = parseField({
            value: oldFormatedValue,
            type: fieldType,
            sourceType: uiType
          });

          // remove the field if error is gone; difficul part is handling range fields properly
          const { errors } = storeState;
          if (errors && errors.fields && errors.fields[fieldName]) {
            // there were errors in state, delete the passed one
            if (isRange) {
              newStoreStateSlice.errors = {
                fields: {
                  [fieldName]: u.omit(path[1])
                }
              }
              if (
                ~Object.keys(errors.fields[fieldName]).indexOf(path[1]) &&
                Object.keys(errors.fields[fieldName]).length === 1
              ) {
                // delete the field if it is an empty object now
                newStoreStateSlice.errors = {
                  fields: u.omit(fieldName)
                }
              }
            } else {
              // not Range
              newStoreStateSlice.errors = {
                fields: u.omit(fieldName)
              }
            }
          }
        } catch (err) {
          const errors = Array.isArray(err) ? err : [err];

          newStoreStateSlice.formFilter = setFieldValue({
            isRange,
            path,
            value: UNPARSABLE_FIELD_VALUE
          });

          if (!isEqual(errors, oldErrorValue)) {
            newStoreStateSlice.errors = {
              fields: setFieldValue({
                isRange,
                path,
                value: errors
              })
            };
          }

          break PARSE_LABEL;
        }

        if (!isEqual(newFormValue, oldFormValue)) {
          newStoreStateSlice.formFilter = setFieldValue({
            isRange,
            path,
            value: u.constant(newFormValue)
          });
        }

        const newFormatedValue = formatField({
          value: newFormValue,
          type: fieldType,
          targetType: uiType
        });

        if (!isEqual(newFormatedValue, oldFormatedValue)) {
          newStoreStateSlice.formatedFilter = setFieldValue({
            isRange,
            path,
            value: u.constant(newFormatedValue)
          });
        }

        if (oldErrorValue) {
          newStoreStateSlice.errors = setFieldValue({
            isRange,
            path,
            value: u.omit(fieldName)
          })
        }
      }

      newStoreStateSlice.divergedField = null;

    // ███████████████████████████████████████████████████████████████████████████████████████████████████████
    } else if (type === ALL_INSTANCES_SELECT) {
      newStoreStateSlice.selectedInstances = storeState.resultInstances;

    // ███████████████████████████████████████████████████████████████████████████████████████████████████████
    } else if (type === ALL_INSTANCES_DESELECT) {
      newStoreStateSlice.selectedInstances = [];

    // ███████████████████████████████████████████████████████████████████████████████████████████████████████
    } else if (type === INSTANCE_SELECT) {
      let { instance } = payload;
      newStoreStateSlice.selectedInstances = storeState.selectedInstances.concat([instance]);

    // ███████████████████████████████████████████████████████████████████████████████████████████████████████
    } else if (type === INSTANCE_DESELECT) {
      let { instance } = payload;
      newStoreStateSlice.selectedInstances = storeState.selectedInstances.filter(ins => ins !== instance);

    // ███████████████████████████████████████████████████████████████████████████████████████████████████████
    }

    return u(newStoreStateSlice, storeState); // returned object is frozen for NODE_ENV === 'development'
  };
};
