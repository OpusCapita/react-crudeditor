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

const data = { // remove doubles
  contracts: Object.keys(
    initialData.contracts.map(({ contractId }) => contractId).
      reduce((obj, id) => ({ ...obj, [id]: '' }), {})
  ).map(id => find(initialData.contracts, ({ contractId }) => contractId === id))
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

  // TODO handle filter by range fields (from...to)
  search = ({ filter, sort, order, offset, max }) => {
    console.log(JSON.stringify({ filter, sort, order, offset, max }, null, 2))
    const searchableData = data.contracts;

    let result = searchableData.slice();

    const filterFields = filter && Object.keys(filter).
      map(key => ({
        [key]: (
          (v, t) => t === FIELD_TYPE_BOOLEAN ?
            Boolean(v) : // cast to boolean
            v // assume string or object otherwise
        )(filter[key], fields[key].type)
      })).
      reduce((obj, el) => ({ ...obj, ...el }), {});

    console.log("\nfilter fields:\n" + JSON.stringify(filterFields, null, 2))

    const filteredData = filter && searchableData.filter(
      item => Object.keys(filterFields).reduce(
        (rez, fieldName) => {
          const fieldValue = filterFields[fieldName];
          const fieldType = fields[fieldName].type;

          if (
            ~RANGE_FIELD_TYPES.indexOf(fieldType) &&
            typeof fieldValue === 'object' &&
            Object.keys(fieldValue).some(key => ~['from', 'to'].indexOf(key))
          ) {
            // handle Range fields

            let match = true;

            if (fieldValue.from !== undefined) {
              match = ~[FIELD_TYPE_NUMBER, FIELD_TYPE_STRING_NUMBER].indexOf(fieldType) ?
                match && Number(item[fieldName]) >= Number(fieldValue.from) :
                match && true // TODO implement for stringDate type
            }

            if (fieldValue.to !== undefined) {
              match = ~[FIELD_TYPE_NUMBER, FIELD_TYPE_STRING_NUMBER].indexOf(fieldType) ?
                match && Number(item[fieldName]) <= Number(fieldValue.to) :
                match && true // TODO implement for stringDate type
            }

            return rez && match

            //
          } else if (~[FIELD_TYPE_BOOLEAN, FIELD_TYPE_STRING_DATE, FIELD_TYPE_STRING_NUMBER].indexOf(fieldType)) {
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

    if (filter) {
      result = filteredData.slice()
    }

    const totalCount = result.length;

    if (sort) {
      // default sort returns ascending ordered array
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

