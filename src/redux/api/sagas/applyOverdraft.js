import { call, takeEvery, put } from 'redux-saga/effects';
import actions from '../actions';
import { apiCall, getPath } from '../../../httpService';

export const applyOverdraft = function* () {
    
    yield takeEvery(actions.APPLY_OVERDRAFT, function*(action) {
        
        /* START LOADING */
        yield put({ type: 'GLOBAL_LOADING_START', payload: { msg: 'Applying endorse'}})

        /* SEND REQUEST TO SERVER */
        console.log(' -- httpService::applyOverdraft::', action.payload.business_name);
        const url  = getPath('URL/APPLY_ENDORSE');
        const fetchData = apiCall(url, 'POST', { business_name: action.payload.business_name })
        const requestEndorse = yield call(fetchData)

        /* HANDLE ERROR RESOPONSE */
        if(typeof requestEndorse.err !== 'undefined' || typeof requestEndorse.data.error !== 'undefined') {
            console.log(' httpService::applyOverdraft() ===== #1' ,JSON.stringify(requestEndorse));

            yield put({ type: actions.APPLY_OVERDRAFT_FAILD, payload: { err: requestEndorse.err, error: requestEndorse.data.error }})
            //REMOVE LOADING AND DISPLAY ERROR
            yield put({ type: 'GLOBAL_LOADING_END'})
            yield put({ type: 'GLOBAL_MSG', payload: {
                msgType: 'error',
                msg: requestEndorse.err || requestEndorse.data.error
            }})
            return;
        }

        /* HANDLE SUCCESS RESOPONSE */
        console.log(' httpService::applyOverdraft() #2 ---- responseJson:');
        console.log(JSON.stringify(requestEndorse.data));
        console.log(' --------- !');
          
        /* SIGN TX AND SEND TO SERVER */
        let tx = requestEndorse.data.tx;
        console.log(' applyOverdraft::tx::' , JSON.stringify(tx));
        const push_url = getPath('URL/PUSH_SIGN_TX');
        const pushData = apiCall(push_url, 'POST', { tx:tx, pk: action.payload.signature })

        /* HANDLE ERROR RESOPONSE */
        if(typeof pushData.data.error !== 'undefined' || typeof pushData.err !== 'undefined') {
            console.log(' ===== #3' ,JSON.stringify(pushData));
            yield put({ type: actions.APPLY_OVERDRAFT_FAILD, payload: { err: pushData.err, error: pushData.data.error }})
            //REMOVE LOADING AND DISPLAY ERROR
            yield put({ type: 'GLOBAL_LOADING_END'})
            yield put({ type: 'GLOBAL_MSG', payload: {
                msgType: 'error',
                msg: requestEndorse.err || requestEndorse.data.error
            }})
            return;
        }

        /* HANDLE SUCCESS RESOPONSE */
        console.log('===========> pushAndSignTX()::res ==> ', JSON.stringify(pushData));
        yield put({ type: actions.APPLY_OVERDRAFT_SUCCESS, payload: pushData.data })
        // RELOAD PROFILE DATA
        yield put({ type: actions.GET_PROFILE, payload: { account_id: action.payload.account_id }})
        //REMOVE LOADING AND DISPLAY SUCCESS MESSAGE
        yield put({ type: 'GLOBAL_LOADING_END'})
        yield put({ type: 'GLOBAL_MSG', payload: {
            msgType: 'success',
            msg: 'Overdraft correctly applied.'
        }})

    });

};
