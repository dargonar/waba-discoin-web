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

    let account;
    try {
      account = recoverAccountFromSeed(mnemonics, is_brainkey);
    } catch (err) {
      yield put({ type: actions.LOGIN_ERROR, payload: { err: 'key_generation_error' }});
      return;
    }

    const url = getPath('URL/BIZ_LOGIN', { account_name });
    const getSecret = apiCall(url)

    const secretRes = yield call(getSecret);
    
    if (typeof secretRes.data.error !== 'undefined') {
      yield put({type: actions.LOGIN_ERROR, payload: secretRes.data })
    }
    else {
      const secret = secretRes.data.secret;
      const destintation_key = secretRes.data.destintation_key; 

      let memo_obj = signMemo(destintation_key, secret, account);
      memo_obj['signed_secret'] = memo_obj.message;

      const pushLogin = apiCall(url, 'POST', memo_obj)
      let { data, err } = yield call(pushLogin)

      if (data && data.login === true) {
        yield put({ type: actions.LOGIN_SUCCESS, payload: {
          keys: account,
          account: account_name,
          secret: data.decrypted_secret,
          account_id: data.account.id,
          raw: data
        }})

        if (remember === true) {
          yield put({ type: actions.LS_WRITE, payload: {
            password: rememberKey,
            credentials: action.payload
          }})
        }
      }
      else
        yield put({ type: actions.LOGIN_ERROR, payload: {err, data} })
    }
  });
}

export function* loginSuccess() {
  yield takeEvery(actions.LOGIN_SUCCESS, function*(payload) {

  });
}

export function* loginError() {
  yield takeEvery(actions.LOGIN_ERROR, function*() {

  });
}

export function* logout() {
  yield takeEvery(actions.LOGOUT, function*() {
    yield put(push('/'));
  });
}

export function* loginFromLocal() {
  yield takeEvery(actions.LS_READ_SUCCESS, function*(action) {
    yield put({
      type: actions.LOGIN_REQUEST,
      payload: action.payload
    });
  })
}

export function* register() {
  yield takeEvery(actions.REGISTER, function*(action) {
    console.log(' -- httpService::register::',JSON.stringify(action));
    const register_url  = getPath('URL/REGISTER_BUSINESS');
    const request  = apiCall(register_url, 'POST', action.payload)

    const { data, err } = yield call(request)
    console.log(data, err, register_url)
    if(err && typeof data.err !== 'undefined') {
      console.log(' httpService::register() ===== #1' ,JSON.stringify(err));
      yield put({type: actions.REGISTER_FAILD, payload: { err, data }})
    }

    else {
      yield put({type: actions.REGISTER_SUCCESS, payload: { data }})
      yield put({type: actions.LOGIN_REQUEST, payload: {
            account_name: action.payload.account_name,
            is_brainkey: true,
            remember: false,
            rememberKey: '',
            mnemonics: action.payload.seed
      }})
      console.log(' httpService::register() #2 ---- OK!');
      console.log(JSON.stringify(data));
    }
  });
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

    fork(loginFromLocal),
    fork(register)
  ]);
}

