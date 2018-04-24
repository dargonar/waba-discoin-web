import { takeLatest, put, call, all, fork, takeEvery  } from 'redux-saga/effects';
import actions from './actions';
import fakeApi from './fakeData';

import { getPath, apiCall } from '../../httpService';

function* getBusinesses(action) {
    yield takeLatest(actions.FETCH_CONFIGURATION_BUSINESSES, function*(action) {
        // const url = getBusinessPath + 'list/' + action.payload.balance + '/' + action.payload.from + '/' + action.payload.limit;
        //const url = getBusinessPath + 'list/' + action.payload.from + '/' + action.payload.limit;
        const url = getPath('URL/GET_BUSINESSES',{ ...action.payload })
        const fetchData = apiCall(url)
        const { data, ex } = yield call(fetchData);
        if (data)
            yield put({ type: actions.FETCH_CONFIGURATION_BUSINESSES_SUCCESS, payload: data.businesses });
        else
            yield put({ type: actions.FETCH_CONFIGURATION_BUSINESSES_SUCCESS, ex });
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
        if (data && typeof data.error === 'undefined' ) {
            yield put({ type: actions.BUSINESS_SET_OVERDRAFT_SUCCESS, payload: {id : action.payload.account_id }});
        }
        else
            yield put({ type: actions.BUSINESS_SET_OVERDRAFT_FAILD, payload: ex });
    })
}

function* reloadBusiness(action) {
    yield takeEvery(actions.BUSINESS_SET_OVERDRAFT_SUCCESS, function*(action) {
        const url = getPath('URL/GET_BUSINESS',{ ...action.payload })
        const fetchData = apiCall(url)
        const { data, ex } = yield call(fetchData);
        if (data)
            yield put({ type: actions.BUSINESS_UPDATE_PROFILE, payload: data });
        else
            yield put({ type: 'NETWORK_FAILURE', payload: ex });
    })
}

export default function* rootSaga() {
    yield all([
      fork(getBusinesses),
      fork(setOverdraft),
      fork(reloadBusiness)
    ]);
  }
  

