import { all, takeEvery, put, fork } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import { getToken, clearToken } from '../../helpers/utility';
import actions from './actions';
import { getKeys } from './fakeAccount';

import { checkLS, writeLS, readLS, cleanLS } from './sagas/secureLocalStorage'

const fakeApiCall = true; // auth0 or express JWT

export function* loginRequest() {
  yield takeEvery('LOGIN_REQUEST', function*(action) {  
    const { keys, err } = yield getKeys('askpassword?')
    if (fakeApiCall && !err) {
      yield put({
        type: actions.LOGIN_SUCCESS,
        account: action.payload.account,
        keys: keys
      });
    } else {
      yield put({ type: actions.LOGIN_ERROR });
    }
  });
}

export function* loginSuccess() {
  yield takeEvery(actions.LOGIN_SUCCESS, function*(payload) {
    
   });
}

export function* loginError() {
  yield takeEvery(actions.LOGIN_ERROR, function*() {});
}

export function* logout() {
  yield takeEvery(actions.LOGOUT, function*() {
    yield put(push('/'));
  });
}

export function* loginFromLocal() {
  yield takeEvery(actions.LS_READ_SUCCESS, function*(action) {
    const { keys, err } = yield getKeys(action.payload.privKey)
    if (!err) {
      yield put({
        type: actions.LOGIN_SUCCESS,
        account: action.payload.account,
        keys: keys
      });
    } else {
      yield put({ type: actions.LOGIN_ERROR });
    }
  })
}

export default function* rootSaga() {
  yield all([
    fork(loginRequest),
    fork(loginSuccess),
    fork(loginError),
    fork(logout),

    fork(checkLS),
    fork(readLS),
    fork(writeLS),
    fork(cleanLS),

    fork(loginFromLocal)
  ]);
}
