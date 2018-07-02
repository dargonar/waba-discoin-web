import { call, takeEvery, put } from 'redux-saga/effects';
import actions from '../actions';
import { apiCall, getPath } from '../../../httpService';

export const getProfile = function* () {
    yield takeEvery(actions.GET_PROFILE, function*(action) {
        const url = getPath('URL/GET_PROFILE', { id: action.payload.account_id });
        const fetchData = apiCall(url);
        
        const { data, err } = yield call(fetchData)
        if(data) {
            yield put({ type: actions.GET_PROFILE_SUCCESS, payload: data })
            // As they share the same type of response I can update the business status as well.
            yield put({ type: actions.GET_SCHEDULE_SUCCESS, payload: { discount_schedule: data.business.discount_schedule } })
        }            
        else
            yield put({ type: actions.GET_PROFILE_FAILD, payload: err })
    });
};
