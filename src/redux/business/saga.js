import { takeLatest, put, call, all, fork, takeEvery } from 'redux-saga/effects';
import actions from './actions';
import { getPath, apiCall } from '../../httpService';
import { signTx } from './sagas/signTx';

function* getBusinesses(action) {
    yield takeLatest(actions.FETCH_CONFIGURATION_BUSINESSES, function*(action) {
        const url = getPath('URL/GET_BUSINESSES',{ ...action.payload })
        const fetchData = apiCall(url)
        const { data, ex } = yield call(fetchData);
        if (data)
            yield put({ type: actions.FETCH_CONFIGURATION_BUSINESSES_SUCCESS, payload: data.businesses });
        else
            yield put({ type: actions.FETCH_CONFIGURATION_BUSINESSES_FAILD, ex });
    })
}

function* setOverdraft(action) {
    yield takeLatest(actions.BUSINESS_SET_OVERDRAFT, function*(action) {
        const url = getPath('URL/SET_OVERDRAFT');
        const body = {
            business_name: action.payload.business_name,
            initial_credit: action.payload.initial_credit
        };
        const fetchData = apiCall(url, 'POST', body, console.log)
        const { data, ex } = yield call(fetchData);

        if (data && typeof data.error === 'undefined' ) 
            //Sign transaction
            yield put({ 
                type: 'signTX',
                payload: {
                    toSign: data,
                    signature: action.payload.pkey,
                    onSuccess: actions.BUSINESS_SET_OVERDRAFT_SUCCESS,
                    onFail: actions.BUSINESS_SET_OVERDRAFT_FAILD
                }
            });
        else
            yield put({ type: actions.BUSINESS_SET_OVERDRAFT_FAILD, payload: ex });
    })
}

function* reloadBusiness(action) {
    yield takeEvery(actions.FETCH_CONFIGURATION_BUSINESS, function*(action) {
        const url = getPath('URL/GET_BUSINESS',{ ...action.payload })
        const fetchData = apiCall(url)
        const { data, ex } = yield call(fetchData);
        if (data)
            yield put({ type: actions.BUSINESS_UPDATE_PROFILE, payload: data });
        else
            yield put({ type: 'NETWORK_FAILURE', payload: ex });
    })
}

const makeSignature = ( data ) => {
    return 'lafirmaqueteparezca'
}

function* saveBusiness(action) {
    console.log( " saveBusiness ========= #1" );
    yield takeEvery(actions.SAVE_BUSINESS, function*(action) {
        
        const url = getPath('URL/UPDATE_BUSINESS', { ...action.payload })
        console.log( " saveBusiness ========= #2");
        const signature = makeSignature(action.payload)

        console.log( " ===> about to POST");
        const fetchData = apiCall(url, 'POST', { business: action.payload, secret: signature })
        const { data, ex } = yield call(fetchData);
        console.log('=====> saveBusiness')
        console.log(JSON.stringify(data))
        if (data)
            yield put({ type: actions.SAVE_BUSINESS_SUCCESS, payload: data });
        else
            yield put({ type: actions.SAVE_BUSINESS_FAIL, payload: ex });
    })
}


function* getSubaccounts(action) {
    yield takeEvery(actions.FETCH_CONFIGURATION_SUBACCOUNTS, function*(action) {
        const url = getPath('URL/GET_SUBACCOUNTS', {
            id: action.payload.id,
            start: action.payload.start || '0',
        })

        const fetchData = apiCall(url)
        const { data, ex } = yield call(fetchData);
        if (data && typeof data !== 'undefined')
            yield put({ type: actions.GET_SUBACCOUNTS_SUCCESS, payload: { account_id: action.payload.id, subaccounts: data }});
        else
            yield put({ type: actions.GET_SUBACCOUNTS_FAIL, payload: ex });
    })
}

function* updateSubaccounts(action) {
    yield takeEvery(actions.UPDATE_SUBACCOUNT, function*(action) {
        const url = getPath('URL/UPDATE_SUBACCOUNTS', 'POST', action.payload)
        const fetchData = apiCall(url,'POST', { account: action.payload })

        const { data, ex } = yield call(fetchData);
        console.log(data, ex)
        if (data)
            yield put({ type: actions.UPDATE_SUBACCOUNT_SUCCESS, payload: { account_id: action.payload.id, data }});
        else
            yield put({ type: actions.UPDATE_SUBACCOUNT_FAIL, payload: ex });
    })
}

export default function* rootSaga() {
    yield all([
      fork(getBusinesses),
      fork(setOverdraft),
      fork(reloadBusiness),
      fork(signTx),
      fork(saveBusiness),
      fork(getSubaccounts),
      fork(updateSubaccounts),
    ]);
  }
  
