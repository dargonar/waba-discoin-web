import { delay } from 'redux-saga';
import { call, put, fork, take, takeEvery } from 'redux-saga/effects';
import actions from '../actions';
import { apiCall, getPath } from '../../../httpService';

  // #   0 = ALL
  // #   1 = NO_CREDIT && NO_BLACK
  // #   2 = HAS_CREDIT
export const searchAccount = function* () {
  yield takeEvery(actions.SEARCH_ACCOUNT, function*(action) {
    console.log( ' --- saga::searchAccount' , JSON.stringify(action.payload));
    const url = getPath('URL/SEARCH_CUSTOMERS', { name: action.payload.account_name||'*', filter: action.payload.filter || '0' })
    const fetchData = apiCall(url)

    const { data, error } = yield call(fetchData);
    console.log(' --- runRequestSuggest:', action.payload, data, error);
    if (data && !data.error && !error) {
      yield put({ type: actions.SEARCH_ACCOUNT_SUCCESS, payload: data });
    } else {
      yield put({ type: actions.SEARCH_ACCOUNT_FAILD, payload: error });
    }
  })
}

// export const searchAllCustomers = function*() {
//   yield takeEvery(actions.SEARCH_ALL_CUSTOMERS, function*() {
//     const url = getPath('URL/ALL_CUSTOMERS');
//     const fetchData = apiCall(url)
//
//     const { data, error } = yield call(fetchData);
//     console.log(' --- runRequestSuggest:', data);
//     if (data && !error) {
//       yield put({ type: actions.SEARCH_CUSTOMERS_SUCCESS, payload: data });
//     } else {
//       yield put({ type: actions.SEARCH_CUSTOMERS_FAILD, payload: error });
//     }
//   })
// }
