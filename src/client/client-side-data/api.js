import cloneDeep from 'lodash/cloneDeep';
import initialData from './data';

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

const api2internal = contract => Object.entries(contract).reduce(
  (rez, [fieldName, fieldValue]) => ({
    ...rez,
    [fieldName]: fieldValue !== null && NUMBER_FIELDS.includes(fieldName) ?
      Number(fieldValue) :
      fieldValue
  }),
  {}
);

const data = { // remove doubles
  contracts: [...new Set(initialData.contracts.map(({ contractId }) => contractId))].
    map(id => initialData.contracts.find(({ contractId }) => contractId === id))
}

export const

  getNumberOfInstances = _ => data.contracts.length, // for testing
  getContracts = _ => data.contracts,

  get = ({ instance }) => internal2api(
    data.contracts.find(({ contractId }) => contractId === instance.contractId)
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
      data.contracts = data.contracts.map(
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
      data.contracts = data.contracts.filter(({ contractId }) => !idsToDelete.includes(contractId));
      return instances.length;
    }
  )(data, instances),

  search = ({ filter, sort, order, offset, max }) => {
    //
    // const max = max ? Number.parseInt(max, 10) : 10;
    // const offset = offset ? Number.parseInt(offset, 10) : 0;
  };

