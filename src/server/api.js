import loki from 'lokijs';
import cloneDeep from 'lodash/cloneDeep';

import data from './data.json';

const NUMBER_FIELDS = [
  'maxOrderValue',
  'minOrderValue',
  'freeShippingBoundary',
  'totalContractedAmount',
  'smallVolumeSurcharge',
  'freightSurcharge'
];

const db = new loki();

const contracts = db.addCollection('contracts', {
  unique: ['contractId']
});
const statuses = db.addCollection('statuses');

const existingContractIds = {};

data.contracts.forEach(contract => {
  if (!existingContractIds[contract.contractId]) {
    existingContractIds[contract.contractId] = true;
    contracts.insert(contract);
  }
});

data.statuses.forEach(status => statuses.insert(status));

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

module.exports = function(app) {
  /**
   * =======================================================
   * = CONTRACTS
   * =======================================================
   */
  app.get('/api/contracts', (req, res) => {
    const query = req.query || {};

    if (query.instance) {
      // Request for single instance.
      const { $loki, meta, ...result } = contracts.findOne({ contractId: query.instance.contractId });

      if (result) {
        res.json(internal2api(result));
      } else {
        res.status(404);
        res.json({ message: `Contract ${JSON.stringify(query.instance)} not found` });
      }

      return;
    }

    // Request from Search Form.

    const max = query.max ? Number.parseInt(query.max, 10) : 10;
    const offset = query.offset ? Number.parseInt(query.offset, 10) : 0;

    const filter = query.filter ?
      Object.entries(query.filter).reduce(
        (rez, [name, value]) => ({
          ...rez,
          [name]:
            ['statusId', 'isOffer', 'isPreferred', 'isInternal', 'isFrameContract', 'isStandard', 'minOrderValueRequired'].includes(name) &&
            value ||
            value.hasOwnProperty('from') &&
            value.hasOwnProperty('to') &&
            Object.keys(value).length === 2 &&
            { '$between': [Number(value.from), Number(value.to)] } ||
            value.hasOwnProperty('from') &&
            Object.keys(value) === 1 &&
            { '$gte': Number(value) } ||
            value.hasOwnProperty('to') &&
            Object.keys(value) === 1 &&
            { '$lte': Number(value) } ||
            { '$contains': value }
        }),
        {}
      ) :
      {};
    let sort;

    let result = contracts.chain().
      find(filter);

    if (query.sort) {
      result = result.simplesort(
        query.sort,
        query.order === 'desc'
      );
    }

    const totalCount = result.data().length;
    result = result.offset(offset);

    if (max !== -1) {
      result = result.limit(max);
    }

    result = result.data().map(internal2api);
    res.header('Content-Range', `items ${offset + 1}-${offset + result.length}/${totalCount}`);
    res.json(result.map(({ $loki, meta, ...instance }) => instance));
  });

  /**
   * Create new contract
   */
  app.post('/api/contracts', (req, res) => {
    const doc = req.body;

    try {
      const result = contracts.insert(doc);
      res.json(result);
    } catch (error) {
      res.status(500);

      res.json({ error });
    }
  });

  /**
   * Update contract
   */
  app.put('/api/contracts/:contractId', (req, res) => {
    const doc = req.body;
    const { contractId } = req.params;
    const foundItem = contracts.findOne({ contractId });

    if (foundItem) {
      try {
        const { $loki, meta, ...result } = contracts.update({
          ...foundItem,
          ...api2internal(doc)
        });

        res.json(internal2api(result));
      } catch (error) {
        res.status(500);
        res.json({ error });
      }
    } else {
      res.status(404);
      res.json({ error: `Contract [${contractId}] not found` });
    }
  });

  /**
   * Delete contract
   */
  app.delete('/api/contracts', (req, res) => {
    const instances = req.body;

    contracts.findAndRemove({
      '$or': instances.map(({ contractId }) => ({ contractId }))
    });

    return res.json(instances.length);
  });

  /**
   * =======================================================
   * = STATUSES
   * =======================================================
   */
  app.get('/api/statuses', (req, res) => {
    const query = req.query || {};
    const max = query.max ? Number.parseInt(query.max, 10) : 10;
    const offset = query.offset ? Number.parseInt(query.offset, 10) : 0;

    const result = statuses.chain().
      find().
      offset(offset).
      limit(max).data();
    const totalCount = statuses.count();

    res.header('Content-Range', `items ${offset + 1}-${offset + result.length}/${totalCount}`);
    res.json(result);
  });
};
