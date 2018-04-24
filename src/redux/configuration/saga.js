import { takeLatest, put, call, all, fork  } from 'redux-saga/effects';
import actions from './actions';
import { getPath, apiCall } from '../../httpService';

const getCategoriesPath = 'http://35.163.59.126:8080/api/v3/dashboard/categories';

function* getParameters(action) {
    yield takeLatest(actions.FETCH_CONFIGURATION_PARAMETERS, function*() {
        const url = getPath('URL/GET_PARAMETERS')
        const fetchData = apiCall(url)
        const { data, ex } = yield call(fetchData);
        if (data)
            yield put({ type: actions.FETCH_CONFIGURATION_PARAMETERS_SUCCESS, payload: data });
        else
            yield put({ type: actions.FETCH_CONFIGURATION_PARAMETERS_FAILD, ex });
    })
}

function* getCategories(action) {
    yield takeLatest(actions.FETCH_CONFIGURATION_CATEGORIES, function*() {
        const url = getPath('URL/GET_CATEGORIES')
        const fetchData = apiCall(url)
        const { data, ex } = yield call(fetchData);
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
  

