import { call, select } from 'redux-saga/effects';

import editSaga from './edit';
import searchWithOffset from '../../search/workerSagas/searchWithOffset';

import { VIEW_NAME } from '../constants';
import { ERROR_NOT_FOUND } from '../../../common/constants';

export default function*({
  modelDefinition,
  action: {
    payload: {
      side
    },
    meta
  },
  searchParams
}) {
  const incNum = side === 'next' ? 1 :
    side === 'prev' ? -1 :
      0; // should never happen
  // FIXME DONE: throw error in shoud-never-happen case.

  // FIXME DONE: do TODO
  if (incNum === 0) { // TODO delete this 'if' after testing
    console.error('Unexpected side: ' + side);
    throw new Error(`Unexpected side: ${side}`)
  }

  const instance = yield select(storeState => storeState.views[VIEW_NAME].persistentInstance);

  try {
    const { instances, totalCount, navOffset } = yield call(searchWithOffset(incNum), {
      modelDefinition,
      meta,
      instance,
      searchParams
    })

    try {
      yield call(editSaga, {
        modelDefinition,
        action: {
          payload: {
            instance: instances.length === 0 ? instance : instances[0],
            searchParams: {
              ...searchParams,
              navOffset,
              totalCount,
              ...Object.assign({}, instances.length === 0 ? { error: ERROR_NOT_FOUND } : {})
            }
          },
          meta
        }
      });
    } catch (err) {
      throw err;
    }
  } catch (err) {
    throw err;
  }
}
