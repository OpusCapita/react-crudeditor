import initialData from './data';
import {
  FIELD_TYPE_BOOLEAN,
  FIELD_TYPE_DATE_STRING,
  FIELD_TYPE_STRING,
  FIELD_TYPE_NUMBER_STRING
} from '../../../data-types-lib/constants';
import { api2internal, internal2api } from '../../../server/lib';

const data = { // remove doubles
  contracts: [...new Set(initialData.contracts.map(({ contractId }) => contractId))].
    map(id => initialData.contracts.find(({ contractId }) => contractId === id))
}

export const

  getNumberOfInstances = _ => data.contracts.length, // for testing
  getContracts = _ => data.contracts,

  get = ({ instance }) => internal2api(
    data.contracts.find(({ contractId }) => {
      return contractId === instance.contractId
    })
  ),

  create = ({ instance }) => data.contracts.find(({ contractId }) => contractId === instance.contractId) ?
    new Error("Contract with id " + instance.contractId + " already exists in database!") :
    ((data, instance) => {
      data.contracts.push(instance);
      return instance
    })(data, instance),

  update = ({ instance }) => (
    (data, instance) => {
      const formattedInstance = api2internal(instance);
      data.contracts = data.contracts.map( // eslint-disable-line no-param-reassign
        contract => contract.contractId === instance.contractId ?
          formattedInstance :
          contract
      );
      return formattedInstance
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
  search = fields => ({ filter, sort, order, offset, max }) => {
    const searchableData = data.contracts;

    let result = searchableData.slice();

    const filterFields = filter && Object.keys(filter).
      map(key => ({
        [key]: (
          (v, t) => t === FIELD_TYPE_BOOLEAN ?
            Boolean(v) : // cast to boolean
            v // assume string otherwise
        )(filter[key], fields[key].type)
      })).
      reduce((obj, el) => ({ ...obj, ...el }), {});

    const filteredData = filter && searchableData.filter(
      item => Object.keys(filterFields).reduce(
        (rez, field) => {
          const fieldType = fields[field].type;

          if (~[FIELD_TYPE_BOOLEAN, FIELD_TYPE_DATE_STRING, FIELD_TYPE_NUMBER_STRING].indexOf(fieldType)) {
            const match = item[field] === filterFields[field];
            return rez && match
          } else if (fieldType === FIELD_TYPE_STRING) {
            const match = item[field] && item[field].indexOf(filterFields[field]) > -1;
            return rez && match
          }

          return false
        }, true
      )
    );

    if (filter) {
      result = filteredData.slice()
    }

    if (sort) {
      // default sort returns ascending ordered array
      let orderedSortFieldValues = result.map(el => el[sort]).sort();
      if (order && order === 'desc') {
        orderedSortFieldValues.reverse();
      }
      result = orderedSortFieldValues.map(v => result.find(el => el[sort] === v))
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

    return result
  };

