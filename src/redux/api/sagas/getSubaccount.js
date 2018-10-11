import { call, takeEvery, put, select } from "redux-saga/effects";
import actions from "../actions";
import { apiCall, getPath } from "../../../httpService";

export const getSubaccount = function*() {
  yield takeEvery(actions.GET_SUBACCOUNT, function*(action) {
    const url = getPath("URL/GET_SUBACCOUNTS", {
      id: yield select(state => state.Auth.account_id),
      start: action.payload.start || "0"
    });
    const fetchData = apiCall(url);
    const { data, ex } = yield call(fetchData);
    if (data && typeof data !== "undefined") {
      const subaccount = data.subaccounts
        .filter(account => account.id === action.payload.account_id)
        .reduce((prev, act) => act); //Get only one result)
      yield put({
        type: actions.GET_SUBACCOUNT_SUCCESS,
        payload: {
          subaccount
        }
      });

      //LOAD SUBACCOUNT TRANSACTIONS
      yield put({
        type: actions.SEARCH_ALL_TRANSACTIONS,
        payload: {
          account_id: subaccount.id,
          subaccount: true
        }
      });
    } else {
      yield put({ type: actions.GET_SUBACCOUNT_FAIL, payload: ex });
    }
  });
};
