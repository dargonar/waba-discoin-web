import { all, call, takeEvery, put, fork } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import { getToken, clearToken } from '../../helpers/utility';
import actions from './actions';

import { getPath, apiCall } from '../../httpService';

import { checkLS, writeLS, readLS, cleanLS } from './sagas/secureLocalStorage'

import { signMemo, recoverAccountFromSeed, formatAccountName } from '../../utils';

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

    yield put({ type: 'GLOBAL_LOADING_START', payload: { msg: 'Iniciando sesión '+account_name}})

    if (just_registered_data==null && from_storage_data==null && (!account_name || !mnemonics))
      {
        yield put({ type: actions.LOGIN_ERROR })
        yield put({ type: 'GLOBAL_LOADING_END'})
        yield put({ type: 'GLOBAL_MSG', payload: {
            msgType: 'error',
            msg: 'Información insuficiente para iniciar sesión'
        }})

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
        try {
          account = recoverAccountFromSeed(mnemonics, is_brainkey);
        } catch (e) {
          yield put({type: actions.LOGIN_ERROR, payload: { error: 'invalid_wif' } });

          yield put({ type: 'GLOBAL_LOADING_END'})
          yield put({ type: 'GLOBAL_MSG', payload: {
              msgType: 'error',
              msg: e.toString()
          }})

          return;
        }
      }
    }
    console.log('[redux/auth/saga]-- auth/saga loginRequest:account: ', JSON.stringify(account));
    console.log('[redux/auth/saga]-- auth/saga loginRequest:account_name: ', account_name);
    //METAHACK:
    account_name = formatAccountName(account_name);
    console.log('[redux/auth/saga]-- auth/saga loginRequest:account_name: ', account_name);
    const url = getPath('URL/BIZ_LOGIN', { account_name });
    const getSecret = apiCall(url)

    const secretRes = yield call(getSecret);
    console.log(secretRes)
    if (typeof secretRes.ex !== 'undefined' || typeof secretRes.data.error !== 'undefined') {
      console.log('[redux/auth/saga]-- auth/saga loginRequest ERROR', secretRes)
      yield put({type: actions.LOGIN_ERROR, payload: { err: (typeof secretRes.ex !== 'undefined')? secretRes.ex.message: null, error: secretRes.data }})
      yield put({ type: 'GLOBAL_LOADING_END'})
      yield put({ type: 'GLOBAL_MSG', payload: {
          msgType: 'error',
          msg: secretRes.ex || secretRes.data.error
      }})
      return;
    }
    else {
      console.log('[redux/auth/saga]-- auth/saga loginRequest OK#1')
      const secret = secretRes.data.secret;
      const destintation_key = secretRes.data.destintation_key;

      let memo_obj = signMemo(destintation_key, secret, account);
      memo_obj['signed_secret'] = memo_obj.message;

      const pushLogin = apiCall(url, 'POST', memo_obj)
      let { data, ex } = yield call(pushLogin)

      console.log('[redux/auth/saga]-- auth/saga loginRequest OK#2');
      console.log('[redux/auth/saga]-- auth/saga loginRequest data:', JSON.stringify(data));
      console.log('[redux/auth/saga]-- auth/saga loginRequest err:',JSON.stringify(ex));
      if (data && data.login === true) {
        yield put({ type: actions.LOGIN_SUCCESS, payload: {
          keys: account,
          account: account_name,
          secret: data.decrypted_secret,
          account_id: data.account.id,
          raw: data
        }})

        yield put({ type: 'GLOBAL_LOADING_END'})
        yield put({ type: 'GLOBAL_MSG', payload: {
          msgType: 'success',
          msg: 'Inicio de sesión exitoso.'
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
      {
        yield put({ type: actions.LOGIN_ERROR, payload: {err: (typeof ex !== 'undefined')? ex.message: null, error: data.error } })
        yield put({ type: 'GLOBAL_LOADING_END'})
        yield put({ type: 'GLOBAL_MSG', payload: {
            msgType: 'error',
            msg: ex || data.error
        }})
      }
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

    yield put({ type: 'GLOBAL_LOADING_START', payload: { msg: 'Registrando comercio'}})

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
    console.log('register_url:', JSON.stringify(register_url));
    console.log('my_payload:', JSON.stringify(my_payload));

    const { data, err } = yield call(request)
    console.log(data, err, register_url)
    if(err || typeof data.error !== 'undefined') {
      console.log(' [auth/saga/register]::register() #1 ---- ERROR ' ,JSON.stringify(err),JSON.stringify(data));
      yield put({type: actions.REGISTER_FAILD, payload: { err, data }})
      yield put({ type: 'GLOBAL_LOADING_END'})
      yield put({ type: 'GLOBAL_MSG', payload: {
          msgType: 'error',
          msg: err || data.error
      }})
    }
    else {
      console.log(' [auth/saga/register]::register() #2 ---- OK!', JSON.stringify(data));
      yield put({type: actions.REGISTER_SUCCESS, payload: { data }})
      yield put({ type: 'GLOBAL_LOADING_END'})
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
