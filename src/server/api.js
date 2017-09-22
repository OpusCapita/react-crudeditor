import loki from 'lokijs';
import data from './data.json';
const db = new loki();

const contracts = db.addCollection('contracts', {
  unique: ['contractId']
});
const statuses = db.addCollection('statuses');

data.contracts.forEach(contract => contracts.insert(contract));
data.statuses.forEach(status => statuses.insert(status));

module.exports = function (app) {
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
        res.json(result);
      } else {
        res.status(404);
        res.json({message: `Contract ${JSON.stringify(query.instance)} not found`});
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
            value.hasOwnProperty('from') &&
            value.hasOwnProperty('to') &&
            Object.keys(value).length === 2 &&
            { '$between': [Number(value.from), Number(value.to)] }
          ||
            value.hasOwnProperty('from') &&
            Object.keys(value) === 1 &&
            { '$gte': Number(value) }
          ||
            value.hasOwnProperty('to') &&
            Object.keys(value) === 1 &&
            { '$lte': Number(value) }
          ||
            { '$contains': value }
        }),
        {}
      ) :
      {};
    let sort;

    let result = contracts.chain()
      .find(filter);

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

    result = result.data();

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

      res.json({error});
    }
  });

  /**
   * Update contract
   */
  app.put('/api/contracts/:contractId', (req, res) => {
    const doc = req.body;

    const {contractId} = req.params;
    const foundItem = contracts.findOne({contractId});

    if (foundItem) {
      try {
        const result = contracts.update({
          ...foundItem,
          ...doc
        });

        res.json(result);
      } catch (error) {
        res.status(500);

        res.json({error})
      }
    } else {
      res.status(404);

      res.json({error: `Contract [${contractId}] not found`});
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

    const result = statuses.chain()
      .find()
      .offset(offset)
      .limit(max).data();
    const totalCount = statuses.count();

    res.header('Content-Range', `items ${offset + 1}-${offset + result.length}/${totalCount}`);
    res.json(result);
  });
};
