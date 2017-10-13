import * as api from './api';

const FAKE_RESPONSE_TIMEOUT = 300; // In milliseconds. 0 for no timeout.

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

// the same as syncApi object, but with Promise-wrapped functions
export default wrapApi(FAKE_RESPONSE_TIMEOUT)(syncApi);
