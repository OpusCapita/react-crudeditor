import { getContracts } from '../../api/api';

export default class ReferenceSearchService {
  getIds({ contractId }) {
    const contractIds = getContracts().map(({ contractId }) => contractId);

    let result = contractId ?
      contractIds.filter(cid => cid.includes(contractId)) :
      contractIds;

    const items = result.
      slice(0, 10).
      map(contractId => ({ contractId }))

    return Promise.resolve({ items })
  }
}
