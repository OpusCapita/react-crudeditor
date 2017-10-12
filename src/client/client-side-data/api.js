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

let data = cloneDeep(initialData);

export const

  get = ({ instance }) => internal2api(
    data.contracts.find(({ contractId }) => contractId === instance.contractId)
  ),

  create = ({ instance }) => data.contracts.find(({ contractId }) => contractId === instance.contractId) ?
    console.log("Contract with id " + instance.contractId + " already exists in database!") :
    ((data, instance) => {
      data.contracts.push(instance);
      return instance
    })(data, instance);
