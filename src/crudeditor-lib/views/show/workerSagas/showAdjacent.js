import { call, select } from 'redux-saga/effects';

import showSaga from './show';
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
  navigation
}) {
  const incNum = side === 'next' ? 1 : -1;

  const instance = yield select(storeState => storeState.views[VIEW_NAME].persistentInstance);

  try {
    const { instances, totalCount, offset } = yield call(searchWithOffset(incNum), {
      modelDefinition,
      meta,
      instance,
      navigation
    })

    try {
      yield call(showSaga, {
        modelDefinition,
        action: {
          payload: {
            instance: instances.length === 0 ? instance : instances[0],
            navigation: {
              ...navigation,
              offset,
              totalCount,
              ...(instances.length === 0 ? { error: ERROR_NOT_FOUND } : {})
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
