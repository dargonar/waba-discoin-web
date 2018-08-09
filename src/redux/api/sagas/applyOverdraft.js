import { call, takeEvery, put } from "redux-saga/effects";
import actions from "../actions";
import appActions from "../../app/actions";
import { apiCall, getPath } from "../../../httpService";

export const applyOverdraft = function*() {
  yield takeEvery(actions.APPLY_OVERDRAFT, function*(action) {
    /* START LOADING */
    yield put({
      type: appActions.GLOBAL_LOADING_START,
      payload: { msg: "Solicitando crédito" }
    });

    /* SEND REQUEST TO SERVER */
    console.log(
      " -- saga:applyOverdraft:: account:",
      action.payload.business_name,
      " -- signature:",
      action.payload.signature
    );
    const url = getPath("URL/APPLY_ENDORSE");
    const my_payload = { business_name: action.payload.business_name };
    const fetchData = apiCall(url, "POST", my_payload);
    const requestEndorse = yield call(fetchData);

    console.log(" -- saga:applyOverdraft::", JSON.stringify(my_payload), url);

    /* HANDLE ERROR RESOPONSE */
    if (
      typeof requestEndorse.err !== "undefined" ||
      typeof requestEndorse.data.error !== "undefined"
    ) {
      console.log(
        " redux/api/saga/applyOverdraft::applyOverdraft() ===== #1",
        JSON.stringify(requestEndorse)
      );

      yield put({
        type: actions.APPLY_OVERDRAFT_FAILD,
        payload: { err: requestEndorse.err, error: requestEndorse.data.error }
      });
      //REMOVE LOADING AND DISPLAY ERROR
      yield put({ type: appActions.GLOBAL_LOADING_END });
      yield put({
        type: appActions.GLOBAL_MSG,
        payload: {
          msgType: "error",
          msg: requestEndorse.err || requestEndorse.data.error
        }
      });
      return;
    }

    /* HANDLE SUCCESS RESOPONSE */
    console.log(" httpService::applyOverdraft() #2 ---- responseJson:");
    console.log(JSON.stringify(requestEndorse.data));
    console.log(" --------- !");

    /* SIGN TX AND SEND TO SERVER */
    let tx = requestEndorse.data.tx;
    console.log(" applyOverdraft::tx::", JSON.stringify(tx));

    const push_url = getPath("URL/PUSH_SIGN_TX");
    const pushData = apiCall(push_url, "POST", {
      tx: tx,
      pk: action.payload.signature
    });
    const signData = yield call(pushData);

    console.log(" applyOverdraft::result::", JSON.stringify(signData));

    /* HANDLE ERROR RESOPONSE */
    if (
      typeof signData.data.error !== "undefined" ||
      typeof signData.err !== "undefined"
    ) {
      console.log(" ===== #3", JSON.stringify(signData));
      yield put({
        type: actions.APPLY_OVERDRAFT_FAILD,
        payload: { err: signData.err, error: signData.data.error }
      });
      //REMOVE LOADING AND DISPLAY ERROR
      yield put({ type: appActions.GLOBAL_LOADING_END });
      yield put({
        type: appActions.GLOBAL_MSG,
        payload: {
          msgType: "error",
          msg: signData.err || signData.data.error
        }
      });
      return;
    }

    /* HANDLE SUCCESS RESOPONSE */
    console.log(
      "===========> pushAndSignTX()::res ==> ",
      JSON.stringify(signData)
    );
    yield put({
      type: actions.APPLY_OVERDRAFT_SUCCESS,
      payload: signData.data
    });
    // RELOAD PROFILE DATA
    yield put({
      type: actions.GET_PROFILE,
      payload: { account_id: action.payload.account_id }
    });
    //REMOVE LOADING AND DISPLAY SUCCESS MESSAGE
    yield put({ type: appActions.GLOBAL_LOADING_END });
    yield put({
      type: appActions.GLOBAL_MSG,
      payload: {
        msgType: "success",
        msg: "Felicitaciones. Su crédito fue asignado con éxito!"
      }
    });
  });
};
