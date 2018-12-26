import { call, takeEvery, put } from "redux-saga/effects";
import actions from "../actions";
import { apiCall, getPath } from "../../../httpService";

export const getKpis = function*() {
  yield takeEvery(actions.GET_KPIS, function*(action) {
    const url = getPath("URL/GET_BUSINESS_KPIS", { id: action.payload.account_id });
    const fetchData = apiCall(url);
    let result;

    //catch network error
    try {
      result = yield call(fetchData);
    } catch (err) {
      console.log("Network error: Fail loading KPIS!");
    }

    const { data } = result;
    if (typeof data !== "undefined" && data !== null) {
      yield put({ type: actions.GET_KPIS_SUCCESS, payload: data });
    }
  });
};
