import { delay } from "redux-saga";
import { call, put, takeEvery } from "redux-saga/effects";
import actions from "../actions";
import { apiCall, getPath } from "../../../httpService";

export const fetchTransactions = function*() {
  yield takeEvery(actions.FETCH_TRANSACTIONS, function*({ payload }) {
    const url = getPath("URL/FETCH_TRANSACTIONS", {
      id: payload.account_id
    });

    const fetchData = apiCall(url, "POST", payload);
    const { data, error } = yield call(fetchData);

    console.log(" --- runRequestSuggest:", data);

    if (data && typeof data.error === "undefined") {
      yield put({ type: actions.FETCH_TRANSACTIONS_SUCCESS, payload: data });
    } else {
      yield put({ type: actions.FETCH_TRANSACTIONS_FAILD, payload: { error: data.error } });
    }
  });
};
