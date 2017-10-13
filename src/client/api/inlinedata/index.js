import * as api from './api';

const FAKE_RESPONSE_TIMEOUT = 10; // In milliseconds. 0 for no timeout.

// create Promise wrappers for sync api functions

const sync2promise = timeout => fn => (...args) => new Promise((resolve, reject) => setTimeout(
  _ => {
    const res = fn(...args);
    if (res instanceof Error) {
      reject(res)
    }
    resolve(res)
  }, timeout
));

const wrapApi = timeout => apiObj => Object.keys(apiObj).reduce(
  (rez, apiName) => ({ ...rez, [apiName]: sync2promise(timeout)(apiObj[apiName]) }), {}
)

const syncApi = {
  get: api.get,
  create: api.create,
  update: api.update,
  delete: api.deleteMany,
  search: api.search
}

export const asyncApi = wrapApi(FAKE_RESPONSE_TIMEOUT)(syncApi);

export default {
  get({ instance }) {
    console.log('Making API-get call', JSON.stringify(instance));
    return asyncApi.get({ instance }).
      then(instance => instance);
  },
  search({ filter, sort, order, offset, max }) {
    console.log('Making API-search call', JSON.stringify({ filter, sort, order, offset, max }));
    return asyncApi.search({ filter, sort, order, offset, max }).
      then(instances => {
        console.log("search: instances: " + JSON.stringify(instances))
        return ({
          totalCount: instances.length,
          instances
        })
      });
  },
  delete({ instances }) {
    console.log('Making API-delete call', JSON.stringify(instances));
    return asyncApi.delete({ instances }).
      then(deletedCount => deletedCount);
  },
  create({ instance }) {
    console.log('Making API-create call', JSON.stringify(instance));
    return asyncApi.create({ instance }).
      then(instance => instance).
      catch(_ => ({
        code: 403,
        message: "This is already exists in the database"
      }))
  },
  update({ instance }) {
    console.log('Making API-update call', JSON.stringify(instance));
    return asyncApi.update({ instance }).
      then(instance => instance);
  }
}
