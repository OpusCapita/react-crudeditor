import { getContracts } from '../../api/api';

export default class ReferenceSearchService {
  getData({ contractId, max = 10, offset = 0 }) {
    const contractIds = getContracts().map(({ contractId }) => contractId).sort();

    const result = contractId ?
      contractIds.filter(cid => cid.toLowerCase().includes(contractId.toLowerCase())) :
      contractIds;

    const items = result.
      slice(offset, offset + max).
      map(contractId => ({ contractId }))

    return new Promise(resolve => setTimeout(_ => resolve({
      body: items,
      headers: {
        "content-range": `items ${offset}-${offset + max - 1}/${result.length}`
      }
    }), 300))
  }
}
