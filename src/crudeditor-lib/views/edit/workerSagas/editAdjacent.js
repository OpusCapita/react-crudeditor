import { call, select } from 'redux-saga/effects';

import editSaga from './edit';
// import searchWithOffset from '../../search/workerSagas/searchWithOffset';
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
  const incNum = side === 'next' ? 1 :
    side === 'prev' ? -1 :
      0; // should never happen

  if (incNum === 0) {
    throw new Error(`Unexpected side value of ${side}, expected 'next' or 'prev'.`)
  }

  const instance = yield select(storeState => storeState.views[VIEW_NAME].persistentInstance);

  const { offset: navOffset, nextInc } = navigation;

  // nextInc is a scenario-scoped iterator
  // it resets when 'edit'/'show' view (namely edit/scenario.js or show/scenario.js) is loaded
  // it increments on nextInc.next(1) call
  // or decrements on nextInc.next(-1) call

  let { i, init } = nextInc.next({ i: incNum }).value

  // the first iteration initializes iterator
  // if this is the first one, we need to re-iterate in order to
  // receive a proper value
  // 'init' === false for any iteration after the first one
  if (init) {
    i = nextInc.next({ i: incNum }).value.i
  }

  const offset = navOffset + i;

  try {
    // const { instances, totalCount, offset } = yield call(searchWithOffset(incNum), {
    //   modelDefinition,
    //   meta,
    //   instance,
    //   navigation
    // })
    // TODO doesn't work
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
      yield call(editSaga, {
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
