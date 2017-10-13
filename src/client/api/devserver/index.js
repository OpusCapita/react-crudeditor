import superagent from 'superagent';

export default {
  get({ instance }) {
    console.log('Making API-get call', JSON.stringify(instance));
    return superagent.
      get('/api/contracts/').
      query({ instance }).
      accept('json').
      then(({ body: instance }) => instance).
      catch(({ status, response: { body } }) => Promise.reject({
        code: body && body.code || status,
        payload: body ?
          (body.message ? body.message : body) :
          undefined
      }));
  },
  search({ filter, sort, order, offset, max }) {
    console.log('Making API-search call', JSON.stringify({ filter, sort, order, offset, max }));
    return superagent.
      get('/api/contracts').
      query({ filter, sort, order, offset, max }).
      accept('json').
      then(({
        header: {
          'content-range': contentRange
        },
        body: instances
      }) => ({
        totalCount: Number(contentRange.substring(contentRange.indexOf('/') + 1)),
        instances
      }));
  },
  delete({ instances }) {
    console.log('Making API-delete call', JSON.stringify(instances));
    return superagent.
      del('/api/contracts').
      send(instances).
      accept('json').
      then(({ body: deletedCount }) => deletedCount);
  },
  create({ instance }) {
    console.log('Making API-create call');
    return superagent.
      post('/api/contracts').
      send(instance).
      accept('json').
      then(({ body: instance }) => instance);
  },
  update({ instance }) {
    console.log('Making API-update call', JSON.stringify(instance));
    const { contractId } = instance;
    return superagent.
      put('/api/contracts/' + encodeURIComponent(contractId)).
      send(instance).
      accept('json').
      then(({ body: instance }) => instance);
  }
}
