import { INSTANCES_SEARCH } from './constants';

export
  const searchInstances = ({
    filter,
    sort,
    order,
    max,
    offset
  }, source) => ({
    type: INSTANCES_SEARCH,
    payload: {
      filter,
      sort,
      order,
      max,
      offset
    },
    meta: {
      source
    }
  });
