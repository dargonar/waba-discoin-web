import { call, takeEvery, put } from 'redux-saga/effects';
import actions from '../actions';
import { apiCall, getPath } from '../../../httpService';

export const updateSchedule = function* () {
    yield takeEvery(actions.UPDATE_SCHEDULE, function*(action) {
        const url = getPath('URL/UPDATE_SCHEDULE', { id: action.payload.account_id});
        const fetchData = apiCall(url, 'POST', { 
            discount_schedule: action.payload.schedule,
            signed_secret: action.payload.pkey
        });
        
        const { data, err } = yield call(fetchData)
        if(data.ok === 'ok') 
            yield put({ type: actions.UPDATE_SCHEDULE_SUCCESS, payload: data })
        else
            yield put({ type: actions.UPDATE_SCHEDULE_FAILD, payload: {err, data} })
    });
};
