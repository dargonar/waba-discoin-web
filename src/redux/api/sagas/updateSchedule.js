import { call, takeEvery, put } from "redux-saga/effects";
import actions from "../actions";
import appActions from "../../app/actions";
import { apiCall, getPath } from "../../../httpService";

export const updateSchedule = function*() {
  yield takeEvery(actions.UPDATE_SCHEDULE, function*(action) {
    yield put({
      type: appActions.GLOBAL_LOADING_START,
      payload: { msg: "Actualizando esquema de descuentos" }
    });

    const url = getPath("URL/UPDATE_SCHEDULE", {
      id: action.payload.account_id
    });
    const fetchData = apiCall(url, "POST", {
      discount_schedule: action.payload.schedule,
      signed_secret: action.payload.pkey
    });

    const { data, err } = yield call(fetchData);
    console.log(" -- updateSchedule() data:", JSON.stringify(data));
    if ("ok" in data) {
      console.log(" -- updateSchedule() ok:", JSON.stringify(data));
      yield put({ type: actions.UPDATE_SCHEDULE_SUCCESS, payload: data.ok });
      yield put({ type: appActions.GLOBAL_LOADING_END });
    } else {
      let _err = err;
      if ("error_list" in data) _err = data.error_list[0].error;
      yield put({ type: actions.UPDATE_SCHEDULE_FAILD, payload: _err });
      yield put({ type: appActions.GLOBAL_LOADING_END });
    }
  });
};
