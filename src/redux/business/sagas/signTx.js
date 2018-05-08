import { put, call, takeEvery  } from 'redux-saga/effects';
import { getPath, apiCall } from '../../../httpService';

/*
    The expected payload has the following structure: 
    {
        toSign: { ...., tx: string }, // transaction to be signed
        signature: string,            // private key
        onSuccess: string,            // Action to dispatch on success
        onFail: string,               // Action to dispatch on faild
    }
    This way the signTX saga can be used as a middelware.
    Example: 
        --> SET_OVERDRAFT
            --> SIGN_TX
                    --> SET_OVERDAFT_SUCCESS || SET_OVERDAFT_FAILD

        --> CREATE_STORE
            --> SIGN_TX
                    --> CREATE_STORE_SUCCESS || CREATE_STORE_FAILD
*/

export const signTx = function* (action) {

    yield takeEvery('signTX', function*(action) {

        // PREPARE BODY
        const tx = action.payload.toSign.tx;
        const signature = action.payload.signature;

        // FETCH
        const push_url = getPath('URL/PUSH_SIGN_TX');
        const getTx = apiCall(push_url, 'POST', { tx:tx, pk:signature })

        // EXTRACT FETCH RESULTS and DISPATCH ACTIONS
        const { data, ex } = yield call(getTx);

        if (data) {
            // SUCCESS ACTION (Specified in the payload)
            yield put({ type: action.payload.onSuccess, payload: data.businesses });
        }
        else
            // ERROR ACTION (Specified in the payload)
            yield put({ type: action.payload.onFail, ex });
    })
};