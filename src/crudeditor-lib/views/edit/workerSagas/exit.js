/*
 * XXX: in case of failure, a worker saga must dispatch an appropriate action and exit by throwing an error.
 */
export default function* (modelDefinition) {
  yield put({
    type: VIEW_REDIRECT_REQUEST,
    payload: {
      viewName: VIEW_SEARCH
    }
  });

  const action = yield take([VIEW_REDIRECT_SUCCESS, VIEW_REDIRECT_FAIL]);

  if (action.type === VIEW_REDIRECT_FAIL) {
    throw action.payload;
  }
}
