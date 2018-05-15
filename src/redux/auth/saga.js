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
        token: 'secret token',
        profile: 'Profile',
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
    yield localStorage.setItem('id_token', payload.token);
  });
}

export function* loginError() {
  yield takeEvery(actions.LOGIN_ERROR, function*() {});
}

export function* logout() {
  yield takeEvery(actions.LOGOUT, function*() {
    clearToken();
    yield put(push('/'));
  });
}
export function* checkAuthorization() {
  yield takeEvery(actions.CHECK_AUTHORIZATION, function*() {
    const token = getToken().get('idToken');
    const { keys, err } = yield getKeys('askpassword?')
    if (token && !err) {
      yield put({
        type: actions.LOGIN_SUCCESS,
        token,
        profile: 'Profile',
        keys: keys
      });
    }
  });
}
export default function* rootSaga() {
  yield all([
    fork(checkAuthorization),
    fork(loginRequest),
    fork(loginSuccess),
    fork(loginError),
    fork(logout),

    fork(checkLS),
    fork(readLS),
    fork(writeLS),
    fork(cleanLS)
  ]);
}
