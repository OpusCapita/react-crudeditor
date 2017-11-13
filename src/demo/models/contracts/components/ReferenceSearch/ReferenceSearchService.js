import { getContracts } from '../../api/api';

export default class ReferenceSearchService {
  getIds({ contractId, max = 10, offset = 0 }) {
    const contractIds = getContracts().map(({ contractId }) => contractId).sort();

    let result = contractId ?
      contractIds.filter(cid => cid.toLowerCase().includes(contractId.toLowerCase())) :
      contractIds;

    const items = result.
      slice(offset, offset + max).
      map(contractId => ({ contractId }))

    return Promise.resolve({
      body: items,
      headers: {
        "content-range": `items ${offset}-${offset + max - 1}/${result.length}`
      }
    })
  }
}
