import { delay } from 'redux-saga';
import { call, put, fork, take, takeEvery } from 'redux-saga/effects';
import actions from '../actions';
import { apiCall, getPath } from '../../../httpService';

export const searchCustomers = function* () {
    const { payload } = yield take(actions.SEARCH_CUSTOMERS);
    const url = getPath('URL/SEARCH_CUSTOMERS', { name: payload, filter: '0' })
    const fetchData = apiCall(url)
    
    const { data, error } = yield call(fetchData);
    console.log(' --- runRequestSuggest:', payload, data);
    if (data && !error) {
      yield put({ type: actions.SEARCH_CUSTOMERS_SUCCESS, payload: data });
    } else {
      yield put({ type: actions.SEARCH_CUSTOMERS_FAILD, payload: error });
    }
  
  }


export const searchAllCustomers = function*() {
  yield takeEvery(actions.SEARCH_ALL_CUSTOMERS, function*() {
    const url = getPath('URL/ALL_CUSTOMERS');
    const fetchData = apiCall(url)

    const { data, error } = yield call(fetchData);
    console.log(' --- runRequestSuggest:', data);
    if (data && !error) {
      yield put({ type: actions.SEARCH_CUSTOMERS_SUCCESS, payload: data });
    } else {
      yield put({ type: actions.SEARCH_CUSTOMERS_FAILD, payload: error });
    }
  })
}
