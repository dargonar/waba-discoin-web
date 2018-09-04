import { takeEvery, put } from "redux-saga/effects";
import actions from "../actions";
import authActions from "../../auth/actions";

export const startSystem = function*() {
  yield takeEvery([authActions.LS_CHECK], function*() {
    //Load categories after login
    yield put({ type: actions.GET_CATEGORIES_LIST });
  });
};
