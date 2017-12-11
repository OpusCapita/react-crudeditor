import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import u from 'updeep';

import { getDefaultSortField } from './lib';
import { getLogicalKeyBuilder } from '../lib';

import {
  DEFAULT_MAX,
  DEFAULT_OFFSET,
  DEFAULT_ORDER,

  ALL_INSTANCES_SELECT,
  ALL_INSTANCES_DESELECT,

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

  SEARCH_FORM_TOGGLE
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

const buildDefaultParsedFilter = searchableFields => searchableFields.reduce(
  (rez, {
    name: fieldName
  }) => ({
    ...rez,
    [fieldName]: EMPTY_FIELD_VALUE
  }),
  {}
);

const buildDefaultFormattedFilter = ({
  ui: {
    search: { searchableFields }
  }
}) => searchableFields.reduce(
  (rez, {
    name: fieldName,
    render: {
      valueProp: {
        converter: {
          format
        }
      }
    }
  }) => ({
    ...rez,
    [fieldName]: format(EMPTY_FIELD_VALUE)
  }),
  {}
);

// The function accepts parsed filter and returns corresponding formatted filter.
const buildFormattedFilter = ({
  modelDefinition: {
    ui: {
      search: { searchableFields }
    }
  },
  filter,
  i18n
}) => Object.keys(filter).reduce(
  (rez, fieldName) => {
    let format;

    searchableFields.some(fieldMeta => {
      if (fieldMeta.name === fieldName) {
        ({ format } = fieldMeta.render.valueProp.converter);
        return true;
      }

      return false;
    });

    return {
      ...rez,
      [fieldName]: format(filter[fieldName], { i18n })
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
  formattedFilter: buildDefaultFormattedFilter(modelDefinition),

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
    fields: {}
  },

  status: STATUS_UNINITIALIZED,

  hideSearchForm: false
});

/*
 * XXX:
 * Only objects and arrays are allowed at branch nodes.
 * Only primitive data types are allowed at leaf nodes.
 */
export default (modelDefinition, i18n) => {
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

    /* eslint-disable padded-blocks */
    // ███████████████████████████████████████████████████████████████████████████████████████████████████████████

    if (type === VIEW_INITIALIZE_REQUEST) {
      const { hideSearchForm } = payload;
      if (typeof hideSearchForm === 'boolean') {
        newStoreStateSlice.hideSearchForm = hideSearchForm;
      }
      newStoreStateSlice.status = STATUS_INITIALIZING;

    } else if (type === VIEW_INITIALIZE_FAIL) {
      newStoreStateSlice.status = STATUS_UNINITIALIZED;

    } else if (type === VIEW_INITIALIZE_SUCCESS) {
      newStoreStateSlice.status = STATUS_READY;

    // ███████████████████████████████████████████████████████████████████████████████████████████████████████████

    } else if (type === VIEW_REDIRECT_REQUEST) {
      newStoreStateSlice.status = STATUS_REDIRECTING;

    } else if (type === VIEW_REDIRECT_FAIL) {
      newStoreStateSlice.status = STATUS_READY;

    } else if (type === VIEW_REDIRECT_SUCCESS) {
      // Do not reset store to initial uninitialized state because
      // filter, order, sort, etc. must remain after returning from other Views.
      newStoreStateSlice.formFilter = u.constant(cloneDeep(storeState.resultFilter));

      newStoreStateSlice.selectedInstances = [];

      newStoreStateSlice.formattedFilter = u.constant(buildFormattedFilter({
        modelDefinition,
        filter: storeState.resultFilter,
        i18n
      }));

      newStoreStateSlice.errors = u.constant({
        fields: {}
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

      newStoreStateSlice.status = STATUS_READY;

    } else if (type === INSTANCES_DELETE_FAIL) {
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

      newStoreStateSlice.formattedFilter = u.constant(buildFormattedFilter({
        modelDefinition,
        filter,
        i18n
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
        newStoreStateSlice.status = STATUS_READY;
      }

    // ███████████████████████████████████████████████████████████████████████████████████████████████████████

    } else if (type === INSTANCES_SEARCH_FAIL && storeState.status !== STATUS_INITIALIZING) {
      newStoreStateSlice.status = STATUS_READY;

    // ███████████████████████████████████████████████████████████████████████████████████████████████████████

    } else if (type === FORM_FILTER_RESET) {
      newStoreStateSlice.formattedFilter = u.constant(buildDefaultFormattedFilter(modelDefinition));
      newStoreStateSlice.formFilter = u.constant(buildDefaultParsedFilter(modelDefinition.ui.search.searchableFields));

    // ███████████████████████████████████████████████████████████████████████████████████████████████████████

    } else if (type === FORM_FILTER_UPDATE) {
      const {
        name: fieldName,
        value: fieldValue
      } = payload;

      let converter;

      modelDefinition.ui.search.searchableFields.some(fieldMeta => {
        if (fieldMeta.name === fieldName) {
          ({ converter } = fieldMeta.render.valueProp);
          return true;
        }

        return false;
      });

      PARSE_LABEL: {
        let newFormValue;

        try {
          newFormValue = converter.parse(fieldValue, { i18n });
        } catch (err) {
          const errors = Array.isArray(err) ? err : [err];

          newStoreStateSlice.formFilter = {
            [fieldName]: UNPARSABLE_FIELD_VALUE
          };

          if (!isEqual(fieldValue, storeState.formattedFilter[fieldName])) {
            newStoreStateSlice.formattedFilter = {
              [fieldName]: u.constant(fieldValue)
            };
          }

          if (!isEqual(errors, storeState.errors.fields[fieldName])) {
            newStoreStateSlice.errors = {
              fields: {
                [fieldName]: errors
              }
            };
          }

          break PARSE_LABEL;
        }

        if (!isEqual(newFormValue, storeState.formFilter[fieldName])) {
          newStoreStateSlice.formFilter = {
            [fieldName]: u.constant(newFormValue)
          };
        }

        const newFormattedValue = converter.format(newFormValue, { i18n });

        if (!isEqual(newFormattedValue, storeState.formattedFilter[fieldName])) {
          newStoreStateSlice.formattedFilter = {
            [fieldName]: u.constant(newFormattedValue)
          };
        }

        if (storeState.errors.fields[fieldName]) {
          newStoreStateSlice.errors = u.omit(fieldName);
        }
      }

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

    } else if (type === SEARCH_FORM_TOGGLE) {
      newStoreStateSlice.hideSearchForm = !storeState.hideSearchForm

    // ███████████████████████████████████████████████████████████████████████████████████████████████████████
    /* eslint-enable padded-blocks */
    }

    return u(newStoreStateSlice, storeState); // returned object is frozen for NODE_ENV === 'development'
  };
};
