import { call, takeEvery, put } from "redux-saga/effects";
import actions from "../actions";
import authActions from "../../auth/actions";
import { apiCall, getPath } from "../../../httpService";
import { siteConfig } from "../../../config";

export const getProfile = function*() {
  yield takeEvery(actions.GET_PROFILE, function*(action) {
    console.log("action", action);
    const url = getPath("URL/GET_PROFILE", { id: action.payload.account_id });
    const fetchData = apiCall(url);

    let result;

    //catch network error
    try {
      result = yield call(fetchData);
    } catch (err) {
      console.log("Network error: Fail loading profile!");
    }
    console.log({ result });
    //catch error message in response
    const { data, error, ex } = result;

    if (typeof data !== "undefined" && data !== "null") {
      yield put({ type: actions.GET_PROFILE_SUCCESS, payload: data });
      // As they share the same type of response I can update the business status as well.
      yield put({
        type: actions.GET_SCHEDULE_SUCCESS,
        payload: { discount_schedule: data.business.discount_schedule }
      });
    } else {
      // Logout user
      yield put({
        type: actions.GET_PROFILE_FAILD,
        payload: ex || error || data.error
      });
      yield put({ type: authActions.LOGOUT });
    }
  });

  yield takeEvery(authActions.LS_CHECK_FULL, function*(action) {
    if (siteConfig.adminAccount.indexOf(action.payload.account) === -1) {
      yield put({ type: actions.GET_PROFILE, payload: action.payload });
    }
  });
};
