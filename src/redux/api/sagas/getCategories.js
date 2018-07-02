import { call, takeEvery, put } from "redux-saga/effects";
import actions from "../actions";
//import data from "./fakeData";
import { apiCall, getPath } from "../../../httpService";

export const getCategories = function*() {
  yield takeEvery(actions.GET_CATEGORIES, function*(action) {
    const url = getPath("URL/GET_CATEGORIES");
    const fetchData = apiCall(url);

    const { data, err } = yield call(fetchData);

    if (data)
      yield put({ type: actions.GET_CATEGORIES_SUCCESS, payload: data });
    else yield put({ type: actions.GET_CATEGORIES_FAILD, payload: err });
  });

  yield takeEvery(actions.GET_CATEGORIES_LIST, function*(action) {
    const url = getPath("URL/GET_CATEGORIES_LIST");
    const fetchData = apiCall(url);

    const { data, err } = yield call(fetchData);

    if (data)
      yield put({ type: actions.GET_CATEGORIES_LIST_SUCCESS, payload: data });
    else yield put({ type: actions.GET_CATEGORIES_LIST_FAILD, payload: err });
  });
};
