import cloneDeep from 'lodash/cloneDeep';
import find from 'lodash/find';
import findIndex from 'lodash/findIndex';
import Big from 'big.js';

import initialData from './data';
import {
  FIELD_TYPE_BOOLEAN,
  FIELD_TYPE_STRING_DATE,
  FIELD_TYPE_STRING,
  FIELD_TYPE_STRING_NUMBER,
  FIELD_TYPE_NUMBER
} from '../../../../data-types-lib/constants';

import {
  RANGE_FIELD_TYPES
} from '../../../../crudeditor-lib/views/search/constants';

import { fields } from '../'

const NUMBER_FIELDS = [
  'maxOrderValue',
  'minOrderValue',
  'freeShippingBoundary',
  'totalContractedAmount',
  'smallVolumeSurcharge',
  'freightSurcharge'
];

const internal2api = contract => Object.entries(contract).reduce(
  (rez, [fieldName, fieldValue]) => ({
    ...rez,
    [fieldName]: cloneDeep(fieldValue !== null && NUMBER_FIELDS.includes(fieldName) ?
      fieldValue.toString() :
      fieldValue
    )
  }),
  {}
);

export const testNumberFieldType = "testNumberTypeField";

const data = { // remove doubles
  contracts: Object.keys(
    initialData.contracts.map(({ contractId }) => contractId).
      reduce((obj, id) => ({ ...obj, [id]: '' }), {})
  ).map(id => find(initialData.contracts, ({ contractId }) => contractId === id)).map(
    c => ({
      [testNumberFieldType]: Math.random() * 1000000,
      ...c
    })
  )
}

const setCreatedFields = instance => {
  data.contracts = data.contracts.map(
    contract => contract.contractId === instance.contractId ?
      {
        ...contract,
        createdOn: (new Date()).toISOString(),
        createdBy: 'Alexey Sergeev'
      } :
      contract
  )
}

const setChangedFields = instance => {
  data.contracts = data.contracts.map(
    contract => contract.contractId === instance.contractId ?
      {
        ...contract,
        changedOn: (new Date()).toISOString(),
        changedBy: 'Alexey The Editor'
      } :
      contract
  )
}

export const

  getNumberOfInstances = _ => data.contracts.length,
  getContracts = _ => data.contracts,

  get = ({ instance }) => {
    const item = find(data.contracts, ({ contractId }) => {
      return contractId === instance.contractId
    });

    if (item) {
      return internal2api(item)
    }

    throw new Error("404")
  },

  create = ({ instance }) => {
    if (find(data.contracts, ({ contractId }) => contractId === instance.contractId)) {
      throw new Error("400")
    }

    return ((data, instance) => {
      data.contracts.push(instance);
      setCreatedFields(instance);
      return get({ instance })
    })(data, instance)
  },

  update = ({ instance }) => (
    (data, instance) => {
      if (find(data.contracts, ({ contractId }) => contractId === instance.contractId)) {
        data.contracts = data.contracts.map( // eslint-disable-line no-param-reassign
          contract => contract.contractId === instance.contractId ?
            instance :
            contract
        );
        setChangedFields(instance);
        return get({ instance })
      }
      throw new Error("404")
    }
  )(data, instance),

  deleteMany = ({ instances }) => (
    (data, instances) => {
      const idsToDelete = instances.map(({ contractId }) => contractId);
      data.contracts = data.contracts.filter( // eslint-disable-line no-param-reassign
        ({ contractId }) => !idsToDelete.includes(contractId)
      );
      return instances.length;
    }
  )(data, instances),

  search = ({ filter, sort, order, offset, max, nextTo }) => {
    const searchableData = data.contracts;

    let result = searchableData.slice();

    if (filter) {
      const filteredData = searchableData.filter(
        item => Object.keys(filter).reduce(
          (rez, fieldName) => {
            if (item[fieldName] === undefined) {
              const err = {
                code: 500,
                message: `Fatal error: field ${fieldName} does not exist on instance contractId=${item.contractId}`
              }
              throw err;
            }

            const
              fieldValue = filter[fieldName],
              fieldType = fields[fieldName].type,
              itemValue = item[fieldName];

            // Handle range from..to fields
            // If not object - we should check strict equality to handle search by
            // 'statusId' field
            if (~RANGE_FIELD_TYPES.indexOf(fieldType) && typeof fieldValue === 'object') {
              let match = true;

              if (item[fieldName] !== null) {
                let gte, lte;

                switch (fieldType) {
                  // Number and stringNumber fieldTypes are treated and compared as Numbers
                  case FIELD_TYPE_NUMBER:
                    gte = (itemValue, filterValue) => Number(itemValue) >= Number(filterValue);
                    lte = (itemValue, filterValue) => Number(itemValue) <= Number(filterValue);
                    break;

                  case FIELD_TYPE_STRING_NUMBER:
                    gte = (itemValue, filterValue) => Big(itemValue).gte(Big(filterValue));
                    lte = (itemValue, filterValue) => Big(itemValue).lte(Big(filterValue));
                    break;

                  case FIELD_TYPE_STRING_DATE:
                    gte = (itemValue, filterValue) => new Date(itemValue) >= new Date(filterValue);
                    lte = (itemValue, filterValue) => new Date(itemValue) <= new Date(filterValue);
                    break;
                  default:
                    console.log("Search api switch: Unknown RANGE field type: " + fieldType)
                }

                if (fieldValue.from !== undefined) {
                  match = match && gte(itemValue, fieldValue.from)
                }

                if (fieldValue.to !== undefined) {
                  match = match && lte(itemValue, fieldValue.to)
                }
              } else {
                // null returns false for any range
                match = false;
              }

              return rez && match

              // Now handle non-range fields
            } else if (fieldType === FIELD_TYPE_BOOLEAN) {
              // Boolean() converts incoming null -> false and keeps true -> true or false -> false
              const match = Boolean(itemValue) === fieldValue;
              return rez && match
            } else if (fieldType === FIELD_TYPE_STRING) {
              const match = itemValue !== null ?
                itemValue.toLowerCase().indexOf(fieldValue.toLowerCase()) > -1 :
                false;
              return rez && match
              // we actually need this strict check
              // in order to handle search by 'statusId' field
              // TODO add [], number, date ? strict comparison
            } else if (fieldType === FIELD_TYPE_STRING_NUMBER) {
              const match = Number(fieldValue) === Number(itemValue) && itemValue !== null;
              return rez && match
            }

            return false
          }, true
        )
      );

      result = filteredData.slice()
    }

    const totalCount = result.length;

    if (sort) {
      result = result.sort((a, b) => (a[sort] < b[sort]) ? -1 : 1);
      if (order && order === 'desc') {
        result.reverse();
      }
    }

    if (Number(offset) === parseInt(offset, 10)) {
      const offsetNum = parseInt(offset, 10);
      result = result.length > offsetNum ?
        result.slice(offsetNum) :
        []
    }

    if (nextTo) {
      const previousIndex = findIndex(result, el => el.contractId === nextTo.contractId);

      const nextInstance = previousIndex < (result.length - 1) ?
        result[previousIndex + 1] :
        null;

      return {
        totalCount: 1,
        instances: nextInstance ? [nextInstance].map(internal2api) : []
      }
    }

    if (Number(max) === parseInt(max, 10)) {
      const maxItems = parseInt(max, 10);
      // max = -1 for all items
      if (maxItems > 0) {
        result = result.slice(0, maxItems)
      }
    }

    return {
      totalCount,
      instances: result.map(internal2api)
    }
  }

