import { takeLatest, put, call, all, fork, takeEvery  } from 'redux-saga/effects';
import actions from './actions';
import fakeApi from './fakeData';

const getBusinessPath = 'http://35.163.59.126:8080/api/v3/dashboard/business/';
const getOneBiseness = (id) => `http://35.163.59.126:8080/api/v3/dashboard/business/profile/${id}/load`
const setOverdraftPath = 'http://35.163.59.126:8080/api/v3/business/endorse/create';

function fetchData(url) {    
    return () => {
        return fetch(url)
        .then(res => res.json() )
        .then(data => ({ data }) )
        .catch(ex => {
            return ({ ex });
        });
    };
}

function sendData(url, payload) {    
    return () => {
        return fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload),
        })
        .then(res => res.json() )
        .then(data => ({ data }) )
        .catch(ex => {
            return ({ ex });
        });
    };
}


function* getBusinesses(action) {
    yield takeLatest(actions.FETCH_CONFIGURATION_BUSINESSES, function*(action) {
<<<<<<< Updated upstream
=======
        // const url = getBusinessPath + 'list/' + action.payload.balance + '/' + action.payload.from + '/' + action.payload.limit;
>>>>>>> Stashed changes
        const url = getBusinessPath + 'list/' + action.payload.from + '/' + action.payload.limit;
        const { data, ex } = yield call(fetchData(url));
        if (data)
            yield put({ type: actions.FETCH_CONFIGURATION_BUSINESSES_SUCCESS, payload: data.businesses });
        else
            yield put({ type: actions.FETCH_CONFIGURATION_BUSINESSES_FAILD, ex });
    })
}

function* getBusiness(action) {
    yield takeLatest(actions.FETCH_CONFIGURATION_BUSINESS, function*(action) {
        const url = getBusinessPath + action.payload.id + '/profile/' + action.payload.balance;
        const { data, ex } = yield call(fetchData(url));
        if (data)
            yield put({ type: actions.FETCH_CONFIGURATION_BUSINESS_SUCCESS, payload: data.business });
        else
            yield put({ type: actions.FETCH_CONFIGURATION_BUSINESS_FAILD, ex });
    })
}

function* setOverdraft(action) {
    yield takeLatest(actions.BUSINESS_SET_OVERDRAFT, function*(action) {
        const url = setOverdraftPath;
        const { data, ex } = yield call(sendData(url, { 
            business_name: action.payload.business_name,
            initial_credit: action.payload.initial_credit
        }));
        if (data && typeof data.error === 'undefined' ) {
            yield put({ type: actions.BUSINESS_SET_OVERDRAFT_SUCCESS, payload: action.payload.account_id });
        }
        else
            yield put({ type: actions.BUSINESS_SET_OVERDRAFT_FAILD, payload: ex });
    })
}

function* updateBusiness(action) {
    yield takeEvery(actions.BUSINESS_SET_OVERDRAFT_SUCCESS, function*(action) {
        const url = getOneBiseness(action.payload);
        const { data, ex } = yield call(fetchData(url));
        if (data)
            yield put({ type: actions.BUSINESS_UPDATE_PROFILE, payload: data });
        else
            yield put({ type: 'NETWORK_FAILURE', payload: ex });
    })
}

export default function* rootSaga() {
    yield all([
      fork(getBusinesses),
      fork(getBusiness),
      fork(setOverdraft),
      fork(updateBusiness)
    ]);
  }
  

