import { call, takeEvery, put } from "redux-saga/effects";
import actions from "../actions";
import authActions from "../../auth/actions";
import { apiCall, getPath } from "../../../httpService";
import { siteConfig } from "../../../config";

export const getProfile = function*() {
  yield takeEvery(actions.GET_PROFILE, function*(action) {
    const url = getPath("URL/GET_PROFILE", { id: action.payload.account_id });
    const fetchData = apiCall(url);

    let result;

    //catch network error
    try {
      result = yield call(fetchData);
    } catch (err) {
      console.log("Network error: Fail loading profile!");
    }

    //catch error message in response
    const { data, error } = result.data;

    if (typeof data !== "undefined") {
      yield put({ type: actions.GET_PROFILE_SUCCESS, payload: data });
      // As they share the same type of response I can update the business status as well.
      yield put({
        type: actions.GET_SCHEDULE_SUCCESS,
        payload: { discount_schedule: data.business.discount_schedule }
      });
    } else {
      // Logout user
      yield put({ type: actions.GET_PROFILE_FAILD, payload: error });
      yield put({ type: authActions.LOGOUT });
    }
  });

  yield takeEvery(authActions.LS_CHECK_FULL, function*(action) {
    if (action.payload.account !== siteConfig.adminAccount) {
      yield put({ type: actions.GET_PROFILE, payload: action.payload });
    }
  });
};
