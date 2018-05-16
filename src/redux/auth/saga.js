import { all, call, takeEvery, put, fork } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import { getToken, clearToken } from '../../helpers/utility';
import actions from './actions';

import { getPath, apiCall } from '../../httpService';

import { checkLS, writeLS, readLS, cleanLS } from './sagas/secureLocalStorage'

import { signMemo, recoverAccountFromSeed } from '../../utils';

export function* loginRequest() {
  yield takeEvery(actions.LOGIN_REQUEST, function*(action) {

    const {
      account_name,
      mnemonics,
      is_brainkey,
      remember,
      rememberKey
    } = action.payload;

    const account = recoverAccountFromSeed(mnemonics, is_brainkey);
    const url = getPath('URL/BIZ_LOGIN', { account_name });
    const getSecret = apiCall(url)

    const secretRes = yield call(getSecret);
    
    const secret = secretRes.data.secret;
    const destintation_key = secretRes.data.destintation_key; 

    let memo_obj = signMemo(destintation_key, secret, account);
    memo_obj['signed_secret'] = memo_obj.message;

    const pushLogin = apiCall(url, 'POST', memo_obj)
    let { data, ex } = yield call(pushLogin)

    if (data && data.login === true)
      yield put({ type: actions.LOGIN_SUCCESS, payload: {
        keys: account,
        account: account_name,
        secret: data.decrypted_secret
      }})
    else
      yield put({ type: actions.LOGIN_ERROR })
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
