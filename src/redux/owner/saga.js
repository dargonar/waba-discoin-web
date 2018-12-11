import { takeLatest, put, call, all, fork, takeEvery, select } from "redux-saga/effects";
import actions from "./actions";
import actionsApi from "../api/actions";
import actionsUI from "../app/actions";
import { getPath, apiCall } from "../../httpService";
import { signTx } from "./sagas/signTx";
import { getKeys } from "../utils/getKeys";

function* getBusinesses(action) {
  yield takeLatest(actions.FETCH_CONFIGURATION_BUSINESSES, function*(action) {
    const url = getPath("URL/GET_BUSINESSES");
    const fetchData = apiCall(url, "POST", action.payload);
    const { data } = yield call(fetchData);
    if (data && typeof data.error === "undefined")
      yield put({
        type: actions.FETCH_CONFIGURATION_BUSINESSES_SUCCESS,
        payload: data
      });
    else yield put({ type: actions.FETCH_CONFIGURATION_BUSINESSES_FAILD, payload: { ex: data.error } });
  });

  yield takeLatest(actions.FETCH_BUSINESSES_FILTRED, function*(action) {
    const url = getPath("URL/FILTRED_BUSINESSES", {
      skip: action.payload.page === 1 ? 0 : (action.payload.page - 1) * action.payload.limit,
      count: action.payload.limit
    });
    const categories = [].concat(action.payload.filters.selected_categories).filter(x => !isNaN(x));

    const toSend = {
      filter: {
        selected_categories: categories[1] ? [categories[1]] : categories[0] ? [categories[0]] : [],
        payment_methods: action.payload.filters.payment_methods,
        credited: action.payload.filters.credited
      }
    };
    const fetchData = apiCall(url, "POST", toSend);
    const { data } = yield call(fetchData);
    if (data && typeof data.error === "undefined")
      yield put({
        type: actions.FETCH_CONFIGURATION_BUSINESSES_SUCCESS,
        payload: data
      });
    else yield put({ type: actions.FETCH_CONFIGURATION_BUSINESSES_FAILD, payload: { ex: data.error } });
  });
}

export function* setOverdraftSuccess() {
  yield takeEvery(actions.BUSINESS_SET_OVERDRAFT_SUCCESS, function*(payload) {
    yield put({ type: actionsUI.GLOBAL_LOADING_END });
    yield put({
      type: actionsUI.GLOBAL_MSG,
      payload: {
        msgType: "success",
        msg: "Descubierto asignado satisfactoriamente"
      }
    });

    //Reload bussines list
    const filters = yield select(state => state.Owner.filters);
    if (filters !== null) {
      yield put({ type: actions.FETCH_BUSINESSES_FILTRED, payload: filters });
    }
  });
}

export function* setOverdraftError() {
  yield takeEvery(actions.BUSINESS_SET_OVERDRAFT_FAILD, function*(action) {
    yield put({ type: actionsUI.GLOBAL_LOADING_END });
    yield put({
      type: actionsUI.GLOBAL_MSG,
      payload: {
        msg: action.payload,
        msgType: "error"
      }
    });
  });
}

function* setOverdraft(action) {
  yield takeLatest(actions.BUSINESS_SET_OVERDRAFT, function*(action) {
    let keys;
    try {
      keys = yield getKeys();
    } catch (e) {
      console.log("KEEY - OVERDRAFT ERROR", e);
      yield put({
        type: actions.BUSINESS_SET_OVERDRAFT_FAILD,
        payload: e
      });
      return;
    }
    //pkey:
    //keys.owner.wif ||
    //"5JQGCnJCDyraociQmhDRDxzNFCd8WdcJ4BAj8q1YDZtVpk5NDw9"

    yield put({
      type: actionsUI.GLOBAL_LOADING_START,
      payload: { msg: "Asignando descubierto" }
    });

    const url = getPath("URL/SET_OVERDRAFT");
    const body = {
      business_name: action.payload.business_name,
      initial_credit: action.payload.initial_credit
    };
    const fetchData = apiCall(url, "POST", body, console.log);
    const { data } = yield call(fetchData);

    if (data && typeof data.error === "undefined")
      //Sign transaction
      yield put({
        type: "signTX",
        payload: {
          toSign: data,
          signature: keys.owner.wif,
          onSuccess: actions.BUSINESS_SET_OVERDRAFT_SUCCESS,
          onFail: actions.BUSINESS_SET_OVERDRAFT_FAILD
        }
      });
    else {
      yield put({
        type: actions.BUSINESS_SET_OVERDRAFT_FAILD,
        payload: data.error
      });
    }
  });
}

function* reloadBusiness(action) {
  yield takeEvery(actions.FETCH_CONFIGURATION_BUSINESS, function*(action) {
    const url = getPath("URL/GET_BUSINESS", { ...action.payload });
    const fetchData = apiCall(url);
    const { data } = yield call(fetchData);
    if (data && typeof data.error === "undefined") yield put({ type: actions.BUSINESS_UPDATE_PROFILE, payload: data });
    else yield put({ type: "NETWORK_FAILURE", payload: { ex: data.error } });
  });
}

function* saveBusiness(action) {
  yield takeEvery(actions.SAVE_BUSINESS, function*(action) {
    let keys;
    try {
      keys = yield getKeys();
    } catch (e) {
      console.log("KEY - SAVE BUSINESS ERROR", e);
      yield put({
        type: actionsUI.GLOBAL_MSG,
        payload: {
          msg: e,
          msgType: "error"
        }
      });
      return;
    }

    console.log(" saveBusiness ========= #1");
    yield put({
      type: actionsUI.GLOBAL_LOADING_START,
      payload: { msg: "Guardando comercio" }
    });

    const url = getPath("URL/UPDATE_BUSINESS", { ...action.payload });
    console.log(" saveBusiness ========= #2");
    const signature = yield select(state => keys.active.wif);

    console.log(" ===> about to POST");
    const fetchData = apiCall(url, "POST", {
      business: action.payload,
      secret: signature
    });

    const { data } = yield call(fetchData);
    console.log("=====> saveBusiness");
    console.log(JSON.stringify(data));

    yield put({
      type: actionsUI.GLOBAL_LOADING_END
    });

    if (data && typeof data.error === "undefined") {
      yield put({ type: actions.SAVE_BUSINESS_SUCCESS, payload: data });
      // Update profile store
      yield put({
        type: actionsApi.GET_PROFILE,
        payload: { account_id: action.payload.account_id }
      });
      yield put({
        type: actionsUI.GLOBAL_MSG,
        payload: { msg: "Comercio guardado correctamente", msgType: "success" }
      });
    } else {
      yield put({
        type: actions.SAVE_BUSINESS_FAIL,
        payload: { error: data }
      });
      console.log(JSON.stringify(data));
      yield put({
        type: actionsUI.GLOBAL_MSG,
        payload: {
          msgType: "error",
          msg: "Error al guardar el comercio",
          data: data
        }
      });
    }
  });
}

function* getSubaccounts() {
  yield takeEvery(actions.FETCH_CONFIGURATION_SUBACCOUNTS, function*(action) {
    const url = getPath("URL/GET_SUBACCOUNTS", {
      id: action.payload.account.account_id,
      start: action.payload.start || "0"
    });

    // yield put({
    //   type: actionsUI.GLOBAL_LOADING_START,
    //   payload: { msg: "Cargando subcuenta(s)" }
    // });
    const fetchData = apiCall(url);
    const { data } = yield call(fetchData);
    if (data && typeof data.error === "undefined") {
      yield put({
        type: actions.GET_SUBACCOUNTS_SUCCESS,
        payload: {
          account_id: action.payload.account.account_id,
          subaccounts: data
        }
      });
      // yield put({ type: actionsUI.GLOBAL_LOADING_END });
    } else {
      yield put({ type: actions.GET_SUBACCOUNTS_FAIL, payload: { error: data.error } });
      // yield put({ type: actionsUI.GLOBAL_LOADING_END });
    }
  });
  // yield takeEvery(actions.FETCH_CONFIGURATION_SUBACCOUNTS, function*(action) {
  //   const url = getPath("URL/GET_SUBACCOUNTS", {
  //     id: action.payload.account.account_id,
  //     start: action.payload.start || "0"
  //   });

  //   const fetchData = apiCall(url);
  //   const { datax } = yield call(fetchData);
  //   if (data && typeof data.error === "undefined")
  //     yield put({
  //       type: actions.GET_SUBACCOUNTS_SUCCESS,
  //       payload: {
  //         account_id: action.payload.account.account_id,
  //         subaccounts: data
  //       }
  //     });
  //   else yield put({ type: actions.GET_SUBACCOUNTS_FAIL, payload: {error: data.error} });
  // });
}

function* updateSubaccounts(action) {
  yield takeEvery(actions.UPDATE_SUBACCOUNT, function*(action) {
    const url = getPath("URL/UPDATE_SUBACCOUNTS", "POST", action.payload);
    const fetchData = apiCall(url, "POST", { account: action.payload });

    const { data } = yield call(fetchData);
    console.log(data);
    if (data && typeof data.error === "undefined")
      yield put({
        type: actions.UPDATE_SUBACCOUNT_SUCCESS,
        payload: { account_id: action.payload.id, data }
      });
    else yield put({ type: actions.UPDATE_SUBACCOUNT_FAIL, payload: { ex: data.error } });
  });
}

function* getKpis(action) {
  yield takeLatest(actions.FETCH_KPIS, function*() {
    const url = getPath("URL/GET_KPIS");
    const fetchData = apiCall(url);
    const { data } = yield call(fetchData);
    if (data && typeof data.error === "undefined") yield put({ type: actions.FETCH_KPIS_SUCCESS, payload: data });
    else yield put({ type: actions.FETCH_KPIS_FAIL, payload: data.error });
  });
}

function* getParameters(action) {
  yield takeLatest(actions.FETCH_CONFIGURATION_PARAMETERS, function*() {
    const url = getPath("URL/GET_PARAMETERS");
    const fetchData = apiCall(url);
    const { data } = yield call(fetchData);
    if (data && typeof data.error === "undefined")
      yield put({
        type: actions.FETCH_CONFIGURATION_PARAMETERS_SUCCESS,
        payload: data
      });
    else yield put({ type: actions.FETCH_CONFIGURATION_PARAMETERS_FAILD, payload: { ex: data.error } });
  });
}

function* setParameters(action) {
  yield takeLatest(actions.SEND_CONFIGURATION_PARAMETERS, function*(action) {
    const url = getPath("URL/GET_PARAMETERS");
    const body = {
      configuration: action.payload
    };
    yield put({
      type: actionsUI.GLOBAL_LOADING_START,
      payload: { msg: "Guardando parámetros" }
    });
    const fetchData = apiCall(url, "POST", body, console.log);
    const { data } = yield call(fetchData);

    yield put({
      type: actionsUI.GLOBAL_LOADING_END
    });

    if (data && typeof data.error === "undefined") {
      if (typeof data.error !== "undefined")
        yield put({
          type: actions.SEND_CONFIGURATION_PARAMETERS_FAILD,
          payload: data
        });
      else {
        yield put({ type: actions.SEND_CONFIGURATION_PARAMETERS_SUCCESS });
        yield put({
          type: actionsUI.GLOBAL_MSG,
          payload: {
            msg: "Parametros guardados correctamente",
            msgType: "success"
          }
        });

        yield put({ type: actions.FETCH_CONFIGURATION_PARAMETERS });
      }
    } else {
      yield put({
        type: actions.SEND_CONFIGURATION_PARAMETERS_FAILD,
        payload: { ex: data.error }
      });
    }
  });
}

function* getCategories(action) {
  yield takeLatest(actions.FETCH_CONFIGURATION_CATEGORIES, function*() {
    const url = getPath("URL/GET_CATEGORIES");
    const fetchData = apiCall(url);
    const { data } = yield call(fetchData);
    if (data && typeof data.error === "undefined")
      yield put({
        type: actions.FETCH_CONFIGURATION_CATEGORIES_SUCCESS,
        payload: data
      });
    else yield put({ type: actions.FETCH_CONFIGURATION_CATEGORIES_FAILD, payload: { ex: data.error } });
  });
}

export default function* rootSaga() {
  yield all([
    fork(getBusinesses),
    fork(setOverdraft),
    fork(reloadBusiness),
    fork(signTx),
    fork(saveBusiness),
    fork(getSubaccounts),
    fork(updateSubaccounts),
    fork(setOverdraftSuccess),
    fork(setOverdraftError),
    fork(getKpis),
    fork(getParameters),
    fork(getCategories),
    fork(setParameters)
  ]);
}
