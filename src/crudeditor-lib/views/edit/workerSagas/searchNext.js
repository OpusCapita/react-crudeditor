import { call, select } from 'redux-saga/effects';
import { VIEW_SEARCH } from '../../../common/constants';
import searchSaga from '../../search/workerSagas/search';

export default function* ({
  modelDefinition,
  meta,
  instance
}) {
  // retrieve search params
  const filter = yield select(storeState => storeState.views[VIEW_SEARCH].resultFilter);
  const { field: sort, order } = yield select(storeState => storeState.views[VIEW_SEARCH].sortParams);
  const { offset } = yield select(storeState => storeState.views[VIEW_SEARCH].pageParams);

  try {
    const instances = yield call(searchSaga, {
      modelDefinition,
      action: {
        payload: {
          filter,
          sort,
          order,
          max: -1,
          offset,
          nextTo: instance
        },
        meta
      }
    });
    // if no next instance is found then 'instances' === []
    // we return 'undefined' in this case, instance object otherwise
    return instances[0];
  } catch (err) {
    throw err; // Initialization error(s) are forwarded to the parent saga.
  }
}
