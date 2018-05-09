import { call, takeEvery, put } from 'redux-saga/effects';
import actions from '../actions';
import { apiCall, getPath } from '../../../httpService';

export const getProfile = function* () {
    yield takeEvery(actions.GET_PROFILE, function*(action) {
        const url = getPath('URL/GET_PROFILE', { id: action.payload.account_id });
        const fetchData = apiCall(url);
        
        const { data, err } = yield call(fetchData)
        if(data) 
            yield put({ type: actions.GET_PROFILE_SUCCESS, payload: data })
        else
            yield put({ type: actions.GET_PROFILE_FAILD, payload: err })
    });
};
