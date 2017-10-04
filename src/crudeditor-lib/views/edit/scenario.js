import { VIEW_NAME } from './constants';

import deleteManager from './workerSagas/delete';
import editManager from './workerSagas/edit';
import exitManager from './workerSagas/exit';
import saveManager from './workerSagas/save';

/*
 * The saga manages Edit View initialization and life-cicle.
 *
 * It must handle all errors.
 *
 * After initialization, the saga must
 * either dispath VIEW_INITIALIZE_SUCCESS and continue to main life-cicle
 * or dispatch VIEW_INITIALIZE_FAIL and end.
 * When no initialization needed, VIEW_INITIALIZE_SUCCESS must be dispatched.
 *
 * When the view wants to exit during its main life-cicle,
 * it must dispatch VIEW_REDIRECT_REQUEST action
 * and wait for VIEW_REDIRECT_SUCCESS/VIEW_REDIRECT_FAIL actions.
 * After VIEW_REDIRECT_SUCCESS the saga must end.
 * With VIEW_REDIRECT_FAIL the saga must display the error and continue its life-cicle.
 */
export default function*({
  modelDefinition,
  viewState: {
    instance,
    tab: tabName
  },
  source = 'self'
}) {

  /*██████████████████████*\
   *███ INITIALIZATION ███*
  \*██████████████████████*/

  yield put({
    type: VIEW_INITIALIZE_REQUEST,
    meta: { source }
  });

  try {
    yield call(editManager, modelDefinition, instance);
  } catch(error) {
    // Inform global views manager about initialization failure.
    yield put({
      type: VIEW_INITIALIZE_FAIL,
      payload: error,
      error: true,
      meta: { source }
    });

    return;  // Exit view manager.
  }

  // Inform global views manager about initialization success.
  yield put({
    type: VIEW_INITIALIZE_SUCCESS,
    meta: { source }
  });

  yield put({
    type: TAB_SELECT,
    payload: { tabName },
    meta: { source }
  });

  /*███████████████████████*\
   *███ MAIN LIFE-CICLE ███*
  \*███████████████████████*/

  const choices = {
    blocking: {
      [INSTANCES_DELETE]: deleteManager,
    },
    nonBlocking: {
      [INSTANCE_SAVE]: saveManager,
      [EXIT_VIEW_EDIT]: exitManager
    }
  }

  let lastTask;

  while (true) {
    const action = yield take([
      ...Object.keys(choices.blocking),
      ...Object.keys(choices.nonBlocking)
    ]);

    // Automatically cancel any task started previous if it's still running.
    if (lastTask) {
      yield cancel(lastTask);
    }

    if (~Object.keys(choices.blocking).indexOf(action.type)) {
      try {
        yield call(choices.blocking[action.type], modelDefinition, action);
      } catch() {}  // Swallow all errors in called task.
    } else if (~Object.keys(choices.nonBlocking).indexOf(action.type)) {
      lastTask = yield fork(function*() {
        try {
          yield call(choices.nonBlocking[action.type], action);
        } catch() {}  // Swallow all errors in forked task.
      });
    }
  }
}
