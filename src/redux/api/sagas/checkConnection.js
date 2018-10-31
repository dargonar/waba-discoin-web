import { call, takeEvery, put } from "redux-saga/effects";
import actions from "../actions";
import appActions from "../../app/actions";
import { apiCall, getPath } from "../../../httpService";

export const checkConnection = function*() {
  yield takeEvery([appActions.CONNECTION_STATUS_RETRY, appActions.CONNECTION_STATUS_TRY], function*() {
    const url = getPath("URL/GET_CATEGORIES_LIST");
    const fetchData = apiCall(url);
    const { data } = yield call(fetchData);
    console.log({ connectionStatus: typeof data.error === "undefined" });
  });
};
