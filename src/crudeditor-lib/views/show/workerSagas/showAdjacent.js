import { call, select } from 'redux-saga/effects';

import showSaga from './show';
import searchSaga from '../../search/workerSagas/search';

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
  const instance = yield select(storeState => storeState.views[VIEW_NAME].persistentInstance);

  const incNum = side === 'next' ? 1 : -1;

  const { offset: navOffset, nextInc } = navigation;

  let { i, init } = nextInc.next({ i: incNum }).value

  if (init) {
    i = nextInc.next({ i: incNum }).value.i
  }

  const offset = navOffset + i;

  try {
    const { instances, totalCount, offset: newOffset } = yield call(searchSaga, {
      modelDefinition,
      action: {
        payload: {
          offset
        },
        meta
      }
    });

    try {
      yield call(showSaga, {
        modelDefinition,
        action: {
          payload: {
            instance: instances.length === 0 ? instance : instances[0],
            navigation: {
              ...navigation,
              offset: newOffset,
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
