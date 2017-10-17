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
    console.log('Making inlinedata API-get call', JSON.stringify(instance));
    return new Promise((resolve, reject) => {
      setTimeout(_ => resolve(get({ instance })), FAKE_RESPONSE_TIMEOUT)
    })//
  },
  search({ filter, sort, order, offset, max }) {
    console.log('Making inlinedata API-search call', JSON.stringify({ filter, sort, order, offset, max }));
    return new Promise((resolve, reject) => {
      setTimeout(_ => resolve(search({ filter, sort, order, offset, max })), FAKE_RESPONSE_TIMEOUT)
    })
  },
  delete({ instances }) {
    console.log('Making inlinedata API-delete call', JSON.stringify(instances));
    return new Promise((resolve, reject) => {
      setTimeout(_ => resolve(deleteMany({ instances })), FAKE_RESPONSE_TIMEOUT)
    })
  },
  create({ instance }) {
    console.log('Making inlinedata API-create call', JSON.stringify(instance));
    return new Promise((resolve, reject) => {
      setTimeout(_ => resolve(create({ instance })), FAKE_RESPONSE_TIMEOUT)
    })//
  },
  update({ instance }) {
    console.log('Making inlinedata API-update call', JSON.stringify(instance));
    return new Promise((resolve, reject) => {
      setTimeout(_ => resolve(update({ instance })), FAKE_RESPONSE_TIMEOUT)
    })//
  }
}
