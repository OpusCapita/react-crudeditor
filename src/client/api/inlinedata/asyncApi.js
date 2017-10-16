import {
  get,
  create,
  update,
  search,
  deleteMany
} from './api';

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
  (rez, apiName) => {
    console.log(apiName + " of obj " + JSON.stringify(Object.keys(apiObj)) + ": " + typeof apiObj[apiName])
    return ({ ...rez, [apiName]: sync2promise(timeout)(apiObj[apiName]) })
  }, {}
)

const syncApi = {
  get,
  create,
  update,
  delete: deleteMany,
  search
}

// the same as syncApi object, but with Promise-wrapped functions
const asyncApi = wrapApi(FAKE_RESPONSE_TIMEOUT)(syncApi);

export default asyncApi;
