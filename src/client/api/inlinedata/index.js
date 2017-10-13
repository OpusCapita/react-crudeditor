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

const wrapSync = sync2promise(FAKE_RESPONSE_TIMEOUT);

export default {
  get: wrapSync(api.get),
  create: wrapSync(api.create),
  update: wrapSync(api.update),
  deleteMany: wrapSync(api.deleteMany),
  search: wrapSync(api.search)
}
