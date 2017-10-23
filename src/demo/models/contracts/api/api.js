import cloneDeep from 'lodash/cloneDeep';
import find from 'lodash/find';
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
      throw new Error("403")
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

  search = ({ filter, sort, order, offset, max }) => {
    const searchableData = data.contracts;

    let result = searchableData.slice();

    if (filter) {
      const filteredData = searchableData.filter(
        item => Object.keys(filter).reduce(
          (rez, fieldName) => {
            const fieldValue = filter[fieldName];
            const fieldType = fields[fieldName].type;

            // Handle range from..to fields
            if (
              ~RANGE_FIELD_TYPES.indexOf(fieldType) &&
              typeof fieldValue === 'object' &&
              Object.keys(fieldValue).some(key => ~['from', 'to'].indexOf(key))
            ) {
              let match = true;

              if (item[fieldName] !== undefined) {
                let convertFunc;

                switch (fieldType) {
                  // Number and stringNumber fieldTypes are treated and compared as Numbers
                  case FIELD_TYPE_NUMBER:
                  case FIELD_TYPE_STRING_NUMBER:
                    convertFunc = field => Number(field);
                    break;
                  case FIELD_TYPE_STRING_DATE:
                    convertFunc = field => new Date(field);
                    break;
                  default:
                    console.log("search api switch: unknown field type " + fieldType)
                }

                if (fieldValue.from !== undefined) {
                  match = match && convertFunc(item[fieldName]) >= convertFunc(fieldValue.from)
                }

                if (fieldValue.to !== undefined) {
                  match = match && convertFunc(item[fieldName]) <= convertFunc(fieldValue.to)
                }
              // the field in undefined on this instance
              } else {
                return false; // TBD: or `match && true`? if field is not defined, then it's not a match?
              }

              return rez && match

              // Now handle non-range fields
            } else if (~[FIELD_TYPE_BOOLEAN, FIELD_TYPE_STRING_DATE, FIELD_TYPE_STRING_NUMBER].indexOf(fieldType)) {
              // TBD do we need to handle search by exact date (as of now)?
              // If yes, should it be a date without time part, e.g. 2011-05-10?
              const match = item[fieldName] === fieldValue;
              return rez && match
            } else if (fieldType === FIELD_TYPE_STRING) {
              const match = item[fieldName] && item[fieldName].indexOf(fieldValue) > -1;
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
      // default Array.prototype.sort returns ascending ordered array
      let orderedSortFieldValues = result.map(el => el[sort]).sort();
      if (order && order === 'desc') {
        orderedSortFieldValues.reverse();
      }
      result = orderedSortFieldValues.map(v => find(result, el => el[sort] === v))
    }

    if (Number(offset) === parseInt(offset, 10)) {
      const offsetNum = parseInt(offset, 10);
      result = result.length > offsetNum ?
        result.slice(offsetNum) :
        []
    }

    if (Number(max) === parseInt(max, 10)) {
      result = result.slice(0, parseInt(max, 10))
    }

    return {
      totalCount,
      instances: result.map(internal2api)
    }
  }

