import { takeLatest, put, call, all, fork, takeEvery  } from 'redux-saga/effects';
import actions from './actions';
import fakeApi from './fakeData';

import { getPath, apiCall } from '../../httpService';


function* signTx(action) {
    yield takeEvery('signTX', function*(action) {
        const url = getPath('URL/SIGN_TX',{ ...action.payload })
        const fetchData = apiCall(url, 'POST', action.payload.toSign)
        const { data, ex } = yield call(fetchData);
        if (data) {
            yield put({type: actions.FETCH_CONFIGURATION_BUSINESS, payload: data.businesses }) 
            yield put({ type: action.payload.onSuccess, payload: data.businesses });
        }
        else
            yield put({ type: action.payload.onFail, ex });
    })
};

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
            //Dispatch other action -> signTX
            yield put({ type: 'signTX', payload: {
                toSign: data,
                onSuccess: actions.BUSINESS_SET_OVERDRAFT_SUCCESS,
                onFail: actions.BUSINESS_SET_OVERDRAFT_FAILD
            }});
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
    yield takeEvery(actions.SAVE_BUSINESS, function*(action) {
        const url = getPath('URL/REGISTER_BUSINESS')

        const signature = makeSignature(action.payload)

        const fetchData = apiCall(url,'POST', { bussines: action.payload, secret: signature })
        const { data, ex } = yield call(fetchData);
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
        if (typeof data !== 'undefined')
            yield put({ type: actions.GET_SUBACCOUNTS_SUCCESS, payload: { account_id: action.payload.id, subaccounts: data }});
        else
            yield put({ type: actions.GET_SUBACCOUNTS_FAIL, payload: ex });
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
    ]);
  }
  

