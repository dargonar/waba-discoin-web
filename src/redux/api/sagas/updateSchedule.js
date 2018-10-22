import { call, takeEvery, put } from "redux-saga/effects";
import actions from "../actions";
import appActions from "../../app/actions";
import { apiCall, getPath } from "../../../httpService";
import { getKeys } from "../../utils/getKeys";

export const updateSchedule = function*() {
  yield takeEvery(actions.UPDATE_SCHEDULE, function*(action) {
    let keys;
    try {
      keys = yield getKeys();
    } catch (e) {
      yield put({
        type: appActions.GLOBAL_MSG,
        payload: {
          msg: e,
          msgType: "error"
        }
      });
      return;
    }

    yield put({
      type: appActions.GLOBAL_LOADING_START,
      payload: { msg: "Actualizando esquema de descuentos" }
    });

    const url = getPath("URL/UPDATE_SCHEDULE", {
      id: action.payload.account_id
    });
    const fetchData = apiCall(url, "POST", {
      discount_schedule: action.payload.schedule,
      signed_secret: keys.owner.wif
    });

    const { data, err } = yield call(fetchData);
    console.log(" -- updateSchedule() data:", JSON.stringify(data));
    if ("ok" in data) {
      console.log(" -- updateSchedule() ok:", JSON.stringify(data));

      //Trigger update_schedule_success actions
      yield put({
        type: actions.UPDATE_SCHEDULE_SUCCESS,
        payload: action.payload.schedule
      });

      //Reload profile
      yield put({
        type: actions.GET_PROFILE,
        payload: {
          account_id: action.payload.account_id
        }
      });

      //Close loading
      yield put({ type: appActions.GLOBAL_LOADING_END });
    } else {
      let _err = err;
      if ("error_list" in data) _err = data.error_list[0].error;
      yield put({ type: actions.UPDATE_SCHEDULE_FAILD, payload: _err });
      yield put({ type: appActions.GLOBAL_LOADING_END });
    }
  });

  yield takeEvery(actions.UPDATE_SCHEDULE_SUCCESS, function*(action) {
    yield put({
      type: appActions.GLOBAL_MSG,
      payload: {
        msg: "Schedule successfully updated",
        msgType: "success"
      }
    });
  });

  yield takeEvery(actions.UPDATE_SCHEDULE_FAILD, function*(action) {
    yield put({
      type: appActions.GLOBAL_MSG,
      payload: {
        msg: "Error when updating schedule",
        msgType: "error"
      }
    });
  });
};
