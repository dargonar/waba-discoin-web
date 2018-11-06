import { call, put, takeEvery } from "redux-saga/effects";
import actions from "../actions";
import { apiCall, getPath } from "../../../httpService";

// #   0 = ALL
// #   1 = NO_CREDIT && NO_BLACK
// #   2 = HAS_CREDIT
export const searchAccount = function*() {
  yield takeEvery(actions.SEARCH_ACCOUNT, function*(action) {
    console.log(" --- saga::searchAccount", JSON.stringify(action.payload));
    const url = getPath("URL/SEARCH_CUSTOMERS", {
      name: action.payload.account_name || "*",
      filter: action.payload.filter || "0"
    });
    const fetchData = apiCall(url);

    const { data } = yield call(fetchData);
    console.log(" --- runRequestSuggest:", action.payload, data);
    if (data && typeof data.error === "undefined") {
      yield put({ type: actions.SEARCH_ACCOUNT_SUCCESS, payload: data });
    } else {
      yield put({ type: actions.SEARCH_ACCOUNT_FAILD, payload: { error: data.error } });
    }
  });
};
