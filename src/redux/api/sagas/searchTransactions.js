import { delay } from "redux-saga";
import { call, put, fork, take, takeEvery } from "redux-saga/effects";
import actions from "../actions";
import { apiCall, getPath } from "../../../httpService";

function* runRequestSuggest({ name, account_id }) {
  const url = getPath("URL/SEARCH_TRANSACTIONS", {
    account_id: account_id,
    name: name,
    filter: "0"
  });
  const fetchData = apiCall(url);

  // const { data } = yield call(fetchData);
  // console.log(" --- runRequestSuggest:", name, data);
  // if (data && typeof data.error === "undefined") {

  const { data, error } = yield call(fetchData);
  console.log(" --- runRequestSuggest:", name, data);
  if (data && !error && (!data.error || typeof data.error === "undefined")) {
    yield put({ type: actions.SEARCH_TRANSACTIONS_SUCCESS, payload: data });
  } else {
    yield put({ type: actions.SEARCH_TRANSACTIONS_FAILD, payload: { error: data.error } });
  }
}

function createLazily(msec = 1000) {
  let ongoing;
  return function*(task, ...args) {
    if (ongoing && ongoing.isRunning()) {
      ongoing.cancel();
    }
    ongoing = yield fork(function*() {
      yield call(delay, msec);
      yield fork(task, ...args);
    });
  };
}

export const searchTransactions = function*() {
  const lazily = createLazily();
  while (true) {
    const { payload } = yield take(actions.SEARCH_TRANSACTIONS);
    yield fork(lazily, runRequestSuggest, payload);
  }
};

export const searchAllTransactions = function*() {
  yield takeEvery(actions.SEARCH_ALL_TRANSACTIONS, function*(action) {
    const url = getPath("URL/ALL_TRANSACTIONS", {
      id: action.payload.account_id
    });
    const fetchData = apiCall(url);

    // const { data, error } = yield call(fetchData);
    // console.log(" --- runRequestSuggest:", data);
    // if (data && typeof data.error === "undefined") {
    //   yield put({ type: actions.SEARCH_TRANSACTIONS_SUCCESS, payload: data });
    // } else {
    //   yield put({ type: actions.SEARCH_TRANSACTIONS_FAILD, payload: { error: data.error } });

    yield put({
      type: "GLOBAL_LOADING_START",
      payload: { msg: "Cargando transacciones" }
    });

    const { data, error } = yield call(fetchData);
    console.log(" --- runRequestSuggest:", data);
    if (data && !error && (!data.error || typeof data.error === "undefined")) {
      yield put({
        type: actions.SEARCH_TRANSACTIONS_SUCCESS,
        payload: { ...data, subaccount: action.payload.subaccount }
      });
      yield put({ type: "GLOBAL_LOADING_END" });
    } else {
      yield put({ type: actions.SEARCH_TRANSACTIONS_FAILD, payload: error });
      yield put({ type: "GLOBAL_LOADING_END" });

    }
  });
};
