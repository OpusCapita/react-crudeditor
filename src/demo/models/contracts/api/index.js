import {
  get,
  create,
  update,
  search,
  deleteMany
} from './api';

const FAKE_RESPONSE_TIMEOUT = 200; // In milliseconds. 0 for no timeout.

export default {
  get({ instance }) {
    // console.log('Making inlinedata API-get call', JSON.stringify(instance));
    return new Promise((resolve, reject) => {
      setTimeout(_ => {
        try {
          const item = get({ instance });
          resolve(item)
          //
          // comment 'resolve' and uncomment 'reject' if you need to test for errors alerts on Search view
          //
          // reject({ code: 404, message: `Server error: Contract ${JSON.stringify(instance.contractId)} not found` })
        } catch (e) {
          reject({ code: 404, message: `Server error: Contract ${JSON.stringify(instance.contractId)} not found` })
        }
      }, FAKE_RESPONSE_TIMEOUT)
    })
  },

  search({ filter, sort, order, offset, max }) {
    // console.log('Making inlinedata API-search call', JSON.stringify({ filter, sort, order, offset, max }));
    return new Promise((resolve, reject) => {
      setTimeout(_ => resolve(search({ filter, sort, order, offset, max })), FAKE_RESPONSE_TIMEOUT)
    })
  },

  delete({ instances }) {
    // console.log('Making inlinedata API-delete call', JSON.stringify(instances));
    return new Promise((resolve, reject) => {
      setTimeout(_ => resolve(deleteMany({ instances })), FAKE_RESPONSE_TIMEOUT)
    })
  },

  create({ instance }) {
    // console.log('Making inlinedata API-create call', JSON.stringify(instance));
    return new Promise((resolve, reject) => {
      setTimeout(_ => {
        try {
          const item = create({ instance });
          resolve(item)
        } catch (e) {
          reject({
            code: 400,
            message: `Server error: Instance with contractId "${instance.contractId}" already exists in the database`
          })
        }
      }, FAKE_RESPONSE_TIMEOUT)
    })
  },

  update({ instance }) {
    // console.log('Making inlinedata API-update call', JSON.stringify(instance));
    return new Promise((resolve, reject) => {
      setTimeout(_ => {
        try {
          const result = update({ instance });
          resolve(result)
        } catch (e) {
          reject({ code: 400, message: `Server error: Contract ${JSON.stringify(instance.contractId)} not found` })
        }
      }, FAKE_RESPONSE_TIMEOUT)
    })
  }
}
