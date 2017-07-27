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
    const max = query.max ? Number.parseInt(query.max, 10) : 10;
    const offset = query.offset ? Number.parseInt(query.offset, 10) : 0;
    const filter = query.filter ?
      Object.entries(query.filter).reduce(
        (rez, [name, value]) => ({
          [name]: {
            '$contains': value
          }
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
    res.json(result);
  });

  app.get('/api/contracts/:contractId', (req, res) => {
    const {contractId} = req.params;

    const result = contracts.findOne({contractId});

    if (result) {
      res.json(result);
    } else {
      res.status(404);

      res.json({message: `Contract [${contractId}] not found`});
    }
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
    const ids = req.body;

    let result = contracts.chain()
      .find({
        'contractId': {
          '$in': ids
        }
      })
      .remove();

    return res.json(ids.length);
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
