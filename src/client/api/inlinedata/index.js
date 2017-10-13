import asyncApi from './asyncApi';
import { getNumberOfInstances } from './api'

export default {
  get({ instance }) {
    console.log('Making inlinedata API-get call', JSON.stringify(instance));
    return asyncApi.get({ instance }).
      then(instance => instance);
  },
  search({ filter, sort, order, offset, max }) {
    console.log('Making inlinedata API-search call', JSON.stringify({ filter, sort, order, offset, max }));
    return asyncApi.search({ filter, sort, order, offset, max }).
      then(instances => ({
        totalCount: getNumberOfInstances(), // temporary thing; more info in api/search TODO
        instances
      })
      );
  },
  delete({ instances }) {
    console.log('Making inlinedata API-delete call', JSON.stringify(instances));
    return asyncApi.delete({ instances }).
      then(deletedCount => deletedCount);
  },
  create({ instance }) {
    console.log('Making inlinedata API-create call', JSON.stringify(instance));
    return asyncApi.create({ instance }).
      then(instance => instance).
      catch(_ => ({
        code: 403,
        message: "This is already exists in the database"
      }))
  },
  update({ instance }) {
    console.log('Making inlinedata API-update call', JSON.stringify(instance));
    return asyncApi.update({ instance }).
      then(instance => instance);
  }
}
