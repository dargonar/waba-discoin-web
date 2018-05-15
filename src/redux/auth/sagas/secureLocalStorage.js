import { takeEvery, put } from 'redux-saga/effects';
import { Aes } from 'bitsharesjs';
 

const actions = {
    LS_CHECK: 'LS/CHECK',
    LS_CHECK_FULL: 'LS/CHECK_FULL',
    LS_CHECK_EMPTY: 'LS/CHECK_EMPTY',
    LS_READ: 'LS/READ',
    LS_READ_SUCCESS: 'LS/READ_SUCCESS',
    LS_READ_FAILD: 'LS/READ_FAILD',
    LS_WRITE: 'LS/WRITE',
    LS_WRITE_SUCCESS: 'LS/WRITE_SUCCESS',
    LS_WRITE_FAILD: 'LS/WRITE_FAILD',
    LS_CLEAN: 'LS/CLEAN',
    LS_CLEAN_SUCCESS: 'LS/CLEAN_SUCCESS'
}

console.log(Aes)

// Check local storage
export const checkLS = function*() {
    yield takeEvery(actions.LS_CHECK, function*(){
        let secure = localStorage.getItem('secure')
        if (secure)
            yield put({ type: actions.LS_CHECK_FULL, payload: JSON.parse(secure) })
        else
            yield put({ type: actions.LS_CHECK_EMPTY})
    })
}

// Decrypt local storage
export const readLS = function*() {
    yield takeEvery(actions.LS_READ, function*(action) {
        const { password } = action.payload

        try {
            const decryptTool = Aes.fromSeed(password)
            
            const secureString = localStorage.getItem('secure')
            
            const secureBuffer = Buffer.from(
                Uint8Array.from(
                    JSON.parse(secureString).data
                )
            )

            const jsonData = decryptTool.decrypt(secureBuffer)
            const credentials = JSON.parse(jsonData.toString())
            yield put({ type: actions.LS_READ_SUCCESS, payload: credentials })
        }
        catch(e) {
            yield put({ type: actions.LS_READ_FAILD })
        }
    })
}

// Encrypt and write local storage
export const writeLS = function*() {
    yield takeEvery(actions.LS_WRITE, function*(action) {
        const { password, credentials } = action.payload
        const decryptTool = Aes.fromSeed(password)
        try {
            const jsonData = JSON.stringify(credentials)
            const secure = JSON.stringify(decryptTool.encrypt(jsonData))
            localStorage.setItem('secure', secure)
            yield put({ type: actions.LS_WRITE_SUCCESS, payload: { plain: secure } })
        } 
        catch (err) {
            yield put({ type: actions.LS_WRITE_FAILD, payload: err })
        }
    })
}

// Clean Local storage
export const cleanLS = function*() {
    yield takeEvery(actions.LS_CLEAN, function*(){
        localStorage.removeItem('secure')
        yield put({ type: actions.LS_CLEAN_SUCCESS })
    })
}
