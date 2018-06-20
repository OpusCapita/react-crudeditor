import {
  get,
  create,
  update,
  search,
  deleteMany
} from './api';

const FAKE_RESPONSE_TIMEOUT = 300; // In milliseconds. 0 for no timeout.

export default {
  get({ instance }) {
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

  search({ filter = {}, sort, order, offset, max }) {
    return new Promise((resolve, reject) => {
      setTimeout(_ => resolve(search({ filter, sort, order, offset, max })), FAKE_RESPONSE_TIMEOUT)
    })
  },

  // Bulk deletion.
  // errors array length does not correspond to number of instances failed to be deleted.
  async delete({ instances }) {
    const errors = {};

    const deletionInstances = instances.filter(instance => {
      if (instance.contractId.toLowerCase().indexOf('seminal') !== -1) {
        errors.seminalDeletionAttempt = 'Contracts with IDs containing "seminal" must not be deleted';
        return false;
      }

      if (instance.contractId.toLowerCase().indexOf('emphysema') !== -1) {
        errors.emphysemaDeletionAttempt = 'Contracts with IDs containing "emphysema" must not be deleted';
        return false;
      }

      return true;
    });

    await new Promise((resolve, reject) => setTimeout(
      _ => resolve(deleteMany({ instances: deletionInstances })),
      FAKE_RESPONSE_TIMEOUT
    ));

    return {
      count: deletionInstances.length,
      ...(Object.keys(errors).length && { errors: Object.keys(errors).map(id => ({
        code: 400,
        id,
        message: errors[id]
      })) })
    };
  },

  create({ instance }) {
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
