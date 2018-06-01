import { delay } from 'redux-saga';
import { call, put, fork, take, takeEvery } from 'redux-saga/effects';
import actions from '../actions';
import { apiCall, getPath } from '../../../httpService';

function* runRequestSuggest(name) {
  const url = getPath('URL/SEARCH_CUSTOMERS', { name: name, filter: '0' })
  const fetchData = apiCall(url)
  
  const { data, error } = yield call(fetchData);
  console.log(' --- runRequestSuggest:', name, data);
  if (data && !error) {
    yield put({ type: actions.SEARCH_CUSTOMERS_SUCCESS, payload: data });
  } else {
    yield put({ type: actions.SEARCH_CUSTOMERS_FAILD, payload: error });
  }
}

function createLazily(msec = 1000) {
  let ongoing;
  return function* (task, ...args) {
    if (ongoing && ongoing.isRunning()) {
      ongoing.cancel();
    }
    ongoing = yield fork(function* () {
      yield call(delay, msec);
      yield fork(task, ...args);
    });
  }
}

export const searchCustomers = function* () {
  const lazily = createLazily();
  while (true) {
    const { payload } = yield take(actions.SEARCH_CUSTOMERS);
    yield fork(lazily, runRequestSuggest, payload);
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
