import * as api from './api';

const FAKE_RESPONSE_TIMEOUT = 300; // In milliseconds. 0 for no timeout.

// create Promise wrappers for sync api functions

const makePromise = fn => (...args) => new Promise((resolve, reject) => setTimeout(
  _ => {
    const res = fn(...args);
    if (res instanceof Error) {
      reject(res)
    }
    resolve(res)
  }, FAKE_RESPONSE_TIMEOUT
));

export default {
  get: makePromise(api.get),
  create: makePromise(api.create),
  update: makePromise(api.update),
  deleteMany: makePromise(api.deleteMany),
  search: makePromise(api.search)
}