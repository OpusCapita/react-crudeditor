import { getContracts } from '../../api/api';

export default class ReferenceSearchService {
    getIds({ contractId }) {
      console.log('service request: ' + contractId)
      const contractIds = getContracts().map(({ contractId }) => contractId);

      let result = contractId ?
        contractIds.filter(cid => cid.includes(contractId)) :
        contractIds;

      console.log('result')
      console.log(result)
      const items = result.slice(0, 10).map(contractId => ({ contractId }))
      console.log('items')
      console.log(items)

      return Promise.resolve({ items })
    }
  }