import find from 'lodash/find';
import Big from 'big.js';
import { exists } from '../../../../components/lib';
import initialData from './data';
import { DEFAULT_FIELD_TYPE } from '../../../../crudeditor-lib/common/constants.js';

import {
  FIELD_TYPE_BOOLEAN,
  FIELD_TYPE_STRING_DATE,
  FIELD_TYPE_STRING,
  FIELD_TYPE_STRING_INTEGER,
  FIELD_TYPE_STRING_DECIMAL,
  FIELD_TYPE_DECIMAL,
  FIELD_TYPE_INTEGER
} from '../../../../data-types-lib/constants';

import { fields } from '../'

export const testNumberFieldType = "testNumberTypeField";

const data = { // remove doubles
  contracts: Object.keys(
    initialData.contracts.
      map(({ contractId }) => contractId).
      reduce((obj, id) => ({ ...obj, [id]: '' }), {})
  ).
    map(id => find(initialData.contracts, ({ contractId }) => contractId === id)).
    map(c => ({
      ...c,
      nonExisting: Math.random(),
      [testNumberFieldType]: Math.random() * 1000000,
      parentContract: Math.random() > 0.8 ?
        null :
        initialData.contracts.map(({ contractId }) => contractId)[
          Math.floor(Math.random() * initialData.contracts.length)
        ]
    }))
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

const isRangeObject = obj =>
  typeof obj === 'object' &&
  obj !== null &&
  (obj => {
    const keys = Object.keys(obj);
    return (keys.length === 1 || keys.length === 2) &&
      (keys.indexOf('from') > -1 || keys.indexOf('to') > -1)
  })(obj);

export const

  getNumberOfInstances = _ => data.contracts.length,
  getContracts = _ => data.contracts,

  get = ({ instance }) => {
    const item = find(data.contracts, ({ contractId }) => {
      return contractId === instance.contractId
    });

    if (item) {
      return item
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

  deleteOne = ({ instance }) => (
    (data, instance) => {
      let deleteIndex;

      if (data.contracts.some(({ contractId }, index) => { // eslint-disable-line consistent-return
        if (instance.contractId === contractId) {
          deleteIndex = index;
          return true;
        }
      })) {
        data.contracts.splice(deleteIndex, 1);
      }

      return 1;
    }
  )(data, instance),

  search = ({ filter, sort, order, offset, max }) => {
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
              fieldType = fields[fieldName].type || DEFAULT_FIELD_TYPE,
              itemValue = item[fieldName];

            // Handle range from..to fields
            // If not object - we should check strict equality to handle search by
            // 'statusId' field
            if (isRangeObject(fieldValue)) {
              let match = true;

              if (item[fieldName] !== null) {
                let gte, lte;

                switch (fieldType) {
                  // Number and stringNumber fieldTypes are treated and compared as Numbers
                  case FIELD_TYPE_DECIMAL:
                  case FIELD_TYPE_INTEGER:
                    gte = (itemValue, filterValue) => Number(itemValue) >= Number(filterValue);
                    lte = (itemValue, filterValue) => Number(itemValue) <= Number(filterValue);
                    break;

                  case FIELD_TYPE_STRING_INTEGER:
                  case FIELD_TYPE_STRING_DECIMAL:
                    gte = (itemValue, filterValue) => Big(itemValue).gte(Big(filterValue));
                    lte = (itemValue, filterValue) => Big(itemValue).lte(Big(filterValue));
                    break;

                  case FIELD_TYPE_STRING_DATE:
                    gte = (itemValue, filterValue) => new Date(itemValue) >= new Date(filterValue);
                    lte = (itemValue, filterValue) => {
                      const filterDate = new Date(filterValue);
                      filterDate.setDate(filterDate.getDate() + 1);
                      return new Date(itemValue) <= filterDate;
                    }
                    break;
                  default:
                    console.log("Search api switch: Unknown RANGE field type: " + fieldType);
                    return false;
                }

                if (exists(fieldValue.from)) {
                  match = match && gte(itemValue, String(fieldValue.from).trim())
                }

                if (exists(fieldValue.to)) {
                  match = match && lte(itemValue, String(fieldValue.to).trim())
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
                itemValue.toLowerCase().indexOf(fieldValue.trim().toLowerCase()) > -1 :
                false;
              return rez && match
              // TODO add [] search
            } else if ([
              FIELD_TYPE_STRING_INTEGER,
              FIELD_TYPE_STRING_DECIMAL,
              FIELD_TYPE_DECIMAL,
              FIELD_TYPE_INTEGER
            ].indexOf(fieldType) > -1
            ) {
              const match = itemValue !== null && Number(String(fieldValue).trim()) === Number(itemValue);
              return rez && match
            } else if (fieldType === FIELD_TYPE_STRING_DATE) {
              const match = new Date(String(fieldValue).trim()).valueOf() === new Date(itemValue).valueOf();
              return rez && match
            } else {
              return rez && [null, undefined, ''].indexOf(itemValue) === -1 && itemValue === fieldValue;
            }
          }, true
        )
      );

      result = filteredData.slice()
    }

    const totalCount = result.length;

    if (sort) {
      const fieldType = fields[sort].type || DEFAULT_FIELD_TYPE;
      if (fieldType === FIELD_TYPE_STRING) {
        result = result.sort((a, b) => (a[sort] || '').localeCompare(b[sort] || '', { sensitivity: 'base' }));
      } else {
        result = result.sort((a, b) => (a[sort] < b[sort]) ? -1 : 1);
      }

      if (order && order === 'desc') {
        result.reverse();
      }
    }

    if (Number(offset) === parseInt(offset, 10)) {
      const offsetNum = parseInt(offset, 10);

      const offsetResult = totalCount > offsetNum ?
        result.slice(offsetNum) :
        []

      // handle search for the last page in case that previous last page was completely deleted
      if (offsetResult.length === 0 &&
        max !== undefined &&
        offsetNum >= max &&
        totalCount > 0
      ) {
        const totalPages = Math.ceil(totalCount / max);
        const newOffset = totalPages * max - max;
        result = result.slice(newOffset)
      } else {
        result = offsetResult
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
      instances: result
    }
  }

