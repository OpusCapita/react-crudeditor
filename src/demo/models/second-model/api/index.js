import {
  get,
  create,
  update,
  search,
  deleteOne
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

  // One-by-one deletion.
  // errors array length does correspond to number of instances failed to be deleted.
  async delete({ instances }) {
    const deletionResults = await Promise.all(instances.map(async instance => {
      try {
        const deleteInstance = instance => new Promise((resolve, reject) => setTimeout(
          _ => instance.contractId.toLowerCase().indexOf('seminal') === -1 ?
            (
              instance.contractId.toLowerCase().indexOf('emphysema') === -1 ?
                resolve(deleteOne({ instance })) :
                reject({
                  code: 400,
                  id: 'emphysemaDeletionAttempt',
                  message: 'Contracts with IDs containing "emphysema" must not be deleted'
                })
            ) :
            reject({
              code: 400,
              id: 'seminalDeletionAttempt',
              message: 'Contracts with IDs containing "seminal" must not be deleted'
            }),
          FAKE_RESPONSE_TIMEOUT
        ));
        const deletedCount = await deleteInstance(instance);
        return deletedCount;
      } catch (err) {
        return err;
      }
    }));

    const errors = [];
    let deletedCount = 0;

    deletionResults.forEach(rez => {
      if (typeof rez === 'number') {
        deletedCount += rez;
      } else {
        // rez is an error object.
        errors.push(rez);
      }
    })

    return {
      count: deletedCount,
      ...(errors.length && { errors })
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
