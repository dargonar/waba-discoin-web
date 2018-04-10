import { takeLatest, put, call, all, fork  } from 'redux-saga/effects';
import actions from './actions';

const getParametersPath = 'http://35.163.59.126:8080/api/v3/dashboard/configuration';
const getCategoriesPath = 'http://35.163.59.126:8080/api/v3/dashboard/categories';

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

function* getParameters(action) {
    yield takeLatest(actions.FETCH_CONFIGURATION_PARAMETERS, function*() {
        const { data, ex } = yield call(fetchData(getParametersPath));
        if (data)
            yield put({ type: actions.FETCH_CONFIGURATION_PARAMETERS_SUCCESS, payload: data });
        else
            yield put({ type: actions.FETCH_CONFIGURATION_PARAMETERS_FAILD, ex });
    })
}

function* getCategories(action) {
    yield takeLatest(actions.FETCH_CONFIGURATION_CATEGORIES, function*() {
        const { data, ex } = yield call(fetchData(getCategoriesPath));
        if (data)
            yield put({ type: actions.FETCH_CONFIGURATION_CATEGORIES_SUCCESS, payload: data });
        else
            yield put({ type: actions.FETCH_CONFIGURATION_CATEGORIES_FAILD, ex });
    })
}

export default function* rootSaga() {
    yield all([
      fork(getParameters),
      fork(getCategories)
    ]);
  }
  

