import { call, takeEvery, put } from 'redux-saga/effects';
import actions from '../actions';
import { apiCall, getPath } from '../../../httpService';

export const getConfiguration = function* () {
    yield takeEvery(actions.GET_CONFIGURATION, function*(action) {
        const url = getPath('URL/GET_CONFIGURATION');
        const fetchData = apiCall(url);
        
        const { data, err } = yield call(fetchData)
        if(data) 
            yield put({ type: actions.GET_CONFIGURATION_SUCCESS, payload: data })
        else
            yield put({ type: actions.GET_CONFIGURATION_FAILD, payload: err })
    });
};
