import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import u from 'updeep';

import { getLogicalKeyBuilder } from '../lib';

import {
  format as formatField,
  parse as parseField
} from '../../../data-types-lib';

import {
  RANGE_FIELD_TYPES,

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

  DELETING,
  READY,
  SEARCHING,
  UNINITIALIZED
} from './constants';

import {
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
const setFieldValue = ({ type, path, value }) => {
  const [fieldName, subFieldName] = Array.isArray(path) ? path : [path, null];

  return {
    [fieldName]: subFieldName ? {
      [subFieldName]: value
    } : (
      !RANGE_FIELD_TYPES.includes(type) || isRangeValue(value) ?
        value :
        {  // Assign the same value to each sub-field.
          from: cloneDeep(value),
          to: cloneDeep(value)
        }
    )
  };
};

const buildDefaultParsedFilter = ({
  model: {
    fields: fieldsMeta
  },
  ui: {
    search: { searchableFields }
  }
}) => searchableFields.reduce(
  (rez, { name: fieldName }) => ({
    ...rez,
    ...setFieldValue({
      type: fieldsMeta[fieldName].type,
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
      valueProp: {
        type: targetType
      }
    }
  }) => ({
    ...rez,
    ...setFieldValue({
      type: fieldsMeta[fieldName].type,
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

export const buildDefaultStoreState = modelDefinition => {
  const searchMeta = modelDefinition.ui.search;
  const fieldsMeta = modelDefinition.model.fields;
  const sortByDefaultIndex = searchMeta.resultFields.findIndex(({ sortByDefault }) => !!sortByDefault);

  const defaultStoreState = {

    // Active filter as displayed in Search Result.
    resultFilter: buildDefaultParsedFilter(modelDefinition),

    // Raw filter as displayed in Search Criteria.
    formFilter: buildDefaultParsedFilter(modelDefinition),

    // Raw filter as communicated to Search fields React Components.
    formatedFilter: buildDefaultFormatedFilter(modelDefinition),

    // Field name or array [fieldName, subFieldName] in case of range a user is entering =>
    // formatedFilter[fieldName] is up-to-date,
    // formFilter[fieldName] is obsolete and waits for been filled with parsed formatedFilter[fieldName]
    // (or UNPARSABLE_FIELD_VALUE if the value happens to be unparsable).
    divergedField: null,

    sortParams: {
      field: searchMeta.resultFields[sortByDefaultIndex === -1 ? 0 : sortByDefaultIndex].name,
      order: 'asc'
    },
    pageParams: {
      max: 30,
      offset: 0
    },
    resultInstances: undefined,  // XXX: must be undefined until first extraction.
    selectedInstances: [],  // XXX: must be a sub-array of refs from resultInstances.
    totalCount: undefined,

    errors: {

      // object with keys as field names,
      // values as arrays of Parsing Errors, may not be empty
      // (the object does not have keys for successfully parsed values).
      fields: {},

      // Array of Internal Errors, may be empty.
      general: []
    },

    status: UNINITIALIZED
  };

  return defaultStoreState;
}

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
      !benchmarkInstances.find(benchmarkInstance =>
        isEqual(
          buildLogicalKey(sourceInstance),
          buildLogicalKey(benchmarkInstance)
        )
      )
    );

  return (storeState = buildDefaultStoreState(modelDefinition), { type, payload, error, meta }) => {
    const newStoreStateSlice = {};

    // ███████████████████████████████████████████████████████████████████████████████████████████████████████

    if (type === INSTANCES_SEARCH_REQUEST) {
      newStoreStateSlice.status = SEARCHING;

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

      const fieldsMeta = modelDefinition.model.fields;
      const searchableFields = modelDefinition.ui.search.searchableFields;

      newStoreStateSlice.formatedFilter = u.constant(Object.keys(filter).reduce(
        (rez, fieldName) => {
          const type = fieldsMeta[fieldName].type;

          const targetType = searchableFields.find(
            ({ name }) => name === fieldName
          ).render.valueProp.type;

          return {
            ...rez,
            ...setFieldValue({
              type,
              path: fieldName,
              value: RANGE_FIELD_TYPES.includes(type) ? {
                from: formatField({ type, targetType, value: filter[fieldName].from }),
                to  : formatField({ type, targetType, value: filter[fieldName].to }),
              } :
              formatField({ type, targetType, value: filter[fieldName] })
            })
          };
        },
        {}
      ));

      newStoreStateSlice.resultFilter = u.constant(cloneDeep(filter));
      newStoreStateSlice.formFilter = u.constant(cloneDeep(filter));
      newStoreStateSlice.divergedField = null;

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

      newStoreStateSlice.status = READY;

    // ███████████████████████████████████████████████████████████████████████████████████████████████████████

    } else if (type === INSTANCES_DELETE_REQUEST && storeState.status !== UNINITIALIZED) {
      newStoreStateSlice.status = DELETING;

    // ███████████████████████████████████████████████████████████████████████████████████████████████████████

    } else if (type === INSTANCES_DELETE_SUCCESS && storeState.status !== UNINITIALIZED) {
      const { instances } = payload;
      newStoreStateSlice.selectedInstances = removeInstances(storeState.selectedInstances, instances);
      newStoreStateSlice.resultInstances = removeInstances(storeState.resultInstances, instances);
      newStoreStateSlice.totalCount = storeState.totalCount - instances.length;
      newStoreStateSlice.status = READY;

    // ███████████████████████████████████████████████████████████████████████████████████████████████████████

    } else if (type === INSTANCES_DELETE_FAIL && storeState.status !== UNINITIALIZED) {
      newStoreStateSlice.status = READY;

    // ███████████████████████████████████████████████████████████████████████████████████████████████████████

    } else if (type === INSTANCES_SEARCH_FAIL) {
      newStoreStateSlice.status = storeState.resultInstances ? READY : UNINITIALIZED;

    // ███████████████████████████████████████████████████████████████████████████████████████████████████████

    } else if (type === FORM_FILTER_RESET) {
      newStoreStateSlice.formatedFilter = u.constant(buildDefaultFormatedFilter(modelDefinition));
      newStoreStateSlice.formFilter = u.constant(buildDefaultParsedFilter(modelDefinition));
      newStoreStateSlice.divergedField = null;

    // ███████████████████████████████████████████████████████████████████████████████████████████████████████

    } else if (type === FORM_FILTER_UPDATE) {
      const {
        path,
        value: fieldValue
      } = payload;

      const fieldName = Array.isArray(path) ? path[0] : path;

      newStoreStateSlice.formatedFilter = setFieldValue({
        type: modelDefinition.model.fields[fieldName].type,
        path,
        value: u.constant(fieldValue)
      });

      newStoreStateSlice.divergedField = path;

    // ███████████████████████████████████████████████████████████████████████████████████████████████████████

    } else if (type === FORM_FILTER_PARSE) {
      const { path } = payload;

      const fieldName = Array.isArray(path) ? path[0] : path;
      const fieldType = modelDefinition.model.fields[fieldName].type;

      const uiType = modelDefinition.ui.search.searchableFields.find(
        ({ name }) => name === fieldName
      ).render.valueProp.type;

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

      try {
        const newFormValue = parseField({
          value: oldFormatedValue,
          type: fieldType,
          sourceType: uiType
        });

        if (!isEqual(newFormValue, storeState.formFilter[fieldName])) {
          newStoreStateSlice.formFilter = setFieldValue({
            type: fieldType,
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
            type: fieldType,
            path,
            value: u.constant(newFormatedValue)
          });
        }

        if (oldErrorValue) {
          newStoreStateSlice.errors = setFieldValue({
            type: fieldType,
            path,
            value: u.omit(fieldName)
          })
        }
      } catch(err) {
        newStoreStateSlice.formFilter = setFieldValue({
          type: fieldType,
          path,
          value: UNPARSABLE_FIELD_VALUE
        });

        if (!isEqual(err, oldErrorValue)) {
          newStoreStateSlice.errors = {
            fields: {
              [fieldName]: err
            }
          };
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

    return u(newStoreStateSlice, storeState);  // returned object is frozen for NODE_ENV === 'development'
  };
};
