import { all, call, takeEvery, put, fork } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import { getToken, clearToken } from '../../helpers/utility';
import actions from './actions';

import { getPath, apiCall } from '../../httpService';

import { checkLS, writeLS, readLS, cleanLS } from './sagas/secureLocalStorage'

import { signMemo, recoverAccountFromSeed } from '../../utils';

export function* loginRequest() {
  yield takeEvery(actions.LOGIN_REQUEST, function*(action) {

    let {
      account_name,
      mnemonics,
      is_brainkey,
      remember,
      rememberKey,
      just_registered_data,
      from_storage_data
    } = action.payload;

    if (just_registered_data==null && from_storage_data==null && (!account_name || !mnemonics))
      {
        yield put({ type: actions.LOGIN_ERROR })
        return;
      }

    let account = {};
    if (from_storage_data!=null)
    {
      console.log('[redux/auth/saga]---- from_storage_data :', JSON.stringify(from_storage_data));
      // recien se registro
      account_name  = from_storage_data.account;
      account       = from_storage_data.keys;

      console.log('[redux/auth/saga]---- from_storage_data -- account_name:',account_name, ' -- account:', JSON.stringify(account));
    }
    else {
      if (just_registered_data!=null){
        /*
          ---- just_registered_data : {"seed":"tiempo rumor querer verano higiene hallar sequía sable lado cumbre riñón linterna","name":"comercio01","account_name":"comercio01","email":"comercio01@gmail.com","telephone":"comercio01tel","category":7,"subcategory":9,"owner":{"wif":"5HyQNb4WCNYNMSFjizHVQ5GWtw7bUyJtCHmSnQ9sBr8pxjf7vyn","pubKey":"BTS7VUsXJiEwUFdp4nDHSeo31YA8HXCQDrgsXbJwBRkpRUWmpGeiG"},"active":{"wif":"5HyQNb4WCNYNMSFjizHVQ5GWtw7bUyJtCHmSnQ9sBr8pxjf7vyn","pubKey":"BTS7VUsXJiEwUFdp4nDHSeo31YA8HXCQDrgsXbJwBRkpRUWmpGeiG"},"memo":{"wif":"5HyQNb4WCNYNMSFjizHVQ5GWtw7bUyJtCHmSnQ9sBr8pxjf7vyn","pubKey":"BTS7VUsXJiEwUFdp4nDHSeo31YA8HXCQDrgsXbJwBRkpRUWmpGeiG"},"privKey":"5HyQNb4WCNYNMSFjizHVQ5GWtw7bUyJtCHmSnQ9sBr8pxjf7vyn"}
        */
        console.log('[redux/auth/saga]---- just_registered_data :', JSON.stringify(just_registered_data));
        account_name  = just_registered_data.account_name;
        account       = {
          owner   : just_registered_data.owner,
          active  : just_registered_data.active,
          memo  : just_registered_data.memo
        };
        console.log('[redux/auth/saga]---- just_registered_data -- account_name:',account_name, ' -- account:', JSON.stringify(account));
      }
      else
      {
        console.log('[redux/auth/saga]---- NOT just_registered_data');
        account = recoverAccountFromSeed(mnemonics, is_brainkey);
      }
    }
    console.log('[redux/auth/saga]-- auth/saga loginRequest:account: ', JSON.stringify(account));
    console.log('[redux/auth/saga]-- auth/saga loginRequest:account_name: ', account_name);
    const url = getPath('URL/BIZ_LOGIN', { account_name });
    const getSecret = apiCall(url)

    const secretRes = yield call(getSecret);

    if (typeof secretRes.data.error !== 'undefined') {
      console.log('[redux/auth/saga]-- auth/saga loginRequest ERROR', secretRes.data.error)
      yield put({type: actions.LOGIN_ERROR, payload: secretRes.data.error })
    }
    else {
      console.log('[redux/auth/saga]-- auth/saga loginRequest OK#1')
      const secret = secretRes.data.secret;
      const destintation_key = secretRes.data.destintation_key;

      let memo_obj = signMemo(destintation_key, secret, account);
      memo_obj['signed_secret'] = memo_obj.message;

      const pushLogin = apiCall(url, 'POST', memo_obj)
      let { data, err } = yield call(pushLogin)

      console.log('[redux/auth/saga]-- auth/saga loginRequest OK#2')
      console.log(JSON.stringify(data))
      console.log(JSON.stringify(ex))
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
            keys: account,
            account: account_name,
            account_id: data.account.id,
            password: rememberKey,
            credentials: action.payload
          }})
        }
      }
      else
        yield put({ type: actions.LOGIN_ERROR, payload: {err, error: data.error } })
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

    console.log('-------------saga::loginFromLocal()', JSON.stringify(action.payload));

    yield put({
      type: actions.LOGIN_REQUEST,
      payload: {
        account_name  : null,
        mnemonics     : null,
        is_brainkey   : null,
        remember      : null,
        rememberKey   : null,
        just_registered_data: null,
        from_storage_data: action.payload
      }
    });
  })
}

export function* register() {
  yield takeEvery(actions.REGISTER, function*(action) {
    console.log(' -- [auth/saga/register]::register::',JSON.stringify(action));
    const register_url  = getPath('URL/REGISTER_BUSINESS');
    let my_payload = {... action.payload };
    // Reestructuramos el dict para que no viajen las privadas.
    my_payload.owner  = my_payload.owner.pubKey;
    my_payload.active = my_payload.active.pubKey;
    my_payload.memo   = my_payload.memo.pubKey;
    delete my_payload['seed']

    const request  = apiCall(register_url, 'POST', my_payload)

    console.log(' -- [auth/saga/register]::register:: POSTEANDO!!!');
    const { data, err } = yield call(request)
    console.log(data, err, register_url)
    if(err && typeof data.err !== 'undefined') {
      console.log(' [auth/saga/register]::register() ===== #1' ,JSON.stringify(err));
      yield put({type: actions.REGISTER_FAILD, payload: { err, data }})
    }
    else {
      console.log(' [auth/saga/register]::register() #2 ---- OK!', JSON.stringify(data));
      yield put({type: actions.REGISTER_SUCCESS, payload: { data }})
      yield put({type: actions.LOGIN_REQUEST, payload: {
            account_name: action.payload.account_name,
            is_brainkey:  true,
            remember:     false,
            rememberKey:  '',
            mnemonics:    action.payload.seed,
            just_registered_data:   action.payload
      }})
      //

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
