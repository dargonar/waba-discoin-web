import { takeLatest, put, call, all, fork  } from 'redux-saga/effects';
import actions from './actions';
import fakeApi from './fakeData';

const getBusinessPath = 'http://35.163.59.126:8080/api/v3/dashboard/business/';

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


function* getBusinesses(action) {
    yield takeLatest(actions.FETCH_CONFIGURATION_BUSINESSES, function*(action) {
        const url = getBusinessPath + action.payload.balance + '/' + action.payload.from + '/' + action.payload.limit;
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

export default function* rootSaga() {
    yield all([
      fork(getBusinesses),
      fork(getBusiness),
    ]);
  }
  

