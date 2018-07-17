import { call, takeEvery, put } from "redux-saga/effects";
import actions from "../actions";
import actionsUI from "../../app/actions";
import { apiCall, getPath } from "../../../httpService";

export const manageBusinessCategories = function*() {
  yield takeEvery(actions.ADD_OR_UPDATE_CATEGORY, function*(action) {
    // Show global loading
    yield put({
      type: actionsUI.GLOBAL_LOADING_START,
      payload: { msg: "Saving category" }
    });

    // Make api request
    const url = getPath("URL/ADD_OR_UPDATE_CATEGORY");
    const fetchData = apiCall(url, "POST", action.payload);
    const { data, err } = yield call(fetchData);

    //Hide global loading
    yield put({ type: actionsUI.GLOBAL_LOADING_END });

    //Prepare response
    if (data && !data.error) {
      yield put({
        type: actions.ADD_OR_UPDATE_CATEGORY_SUCCESS,
        payload: data
      });
      //Show success message
      yield put({
        type: actionsUI.GLOBAL_MSG,
        payload: {
          msgType: "success",
          msg: "Category saved"
        }
      });
      //Reload category list
      yield put({
        type: actions.GET_CATEGORIES_LIST
      });
    }
    // Show error message
    else
      yield put({
        type: actions.ADD_OR_UPDATE_CATEGORY_FAILD,
        payload: { err, error: data.error }
      });
    yield put({
      type: actionsUI.GLOBAL_MSG,
      payload: {
        msgType: "error",
        msg: "Error saving category"
      }
    });
  });

  yield takeEvery(actions.DELETE_CATEGORY, function*(action) {
    yield put({
      type: actionsUI.GLOBAL_LOADING_START,
      payload: { msg: "Deleting category" }
    });

    const url = getPath("URL/DELETE_CATEGORY");
    const fetchData = apiCall(url, "POST", action.payload);

    const { data, err } = yield call(fetchData);

    //Hide global loading
    yield put({ type: actionsUI.GLOBAL_LOADING_END });

    //Prepare response
    if (data && !data.error) {
      yield put({
        type: actions.DELETE_CATEGORY_SUCCESS,
        payload: data
      });
      //Show success message
      yield put({
        type: actionsUI.GLOBAL_MSG,
        payload: {
          msgType: "success",
          msg: "Category deleted"
        }
      });
      //Reload category list
      yield put({
        type: actions.GET_CATEGORIES_LIST
      });
    }
    // Show error message
    else
      yield put({
        type: actions.DELETE_CATEGORY_FAILD,
        payload: { err, error: data.error }
      });
    yield put({
      type: actionsUI.GLOBAL_MSG,
      payload: {
        msgType: "error",
        msg: "Error deleting category"
      }
    });
  });
};
