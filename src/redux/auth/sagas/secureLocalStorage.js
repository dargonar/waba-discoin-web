import { takeEvery, put } from 'redux-saga/effects';
import { Aes } from 'bitsharesjs';
import actions from '../actions';
import {decrypt, encrypt, a2hex, hex2a} from '../../../utils/buf2hex';

// Check local storage
export const checkLS = function*() {
    yield takeEvery(actions.LS_CHECK, function*(){
        let account = localStorage.getItem('account')
        console.log('[secureLocalStorage::checkLS] account', JSON.stringify(account));
        if (account)
            yield put({ type: actions.LS_CHECK_FULL, payload: JSON.parse(account) })
        else
            yield put({ type: actions.LS_CHECK_EMPTY})
    })
}


/*
it("Decrypt", function() {
    var aes = Aes.fromSeed("Password01")
    var d = aes.decryptHex(encrypted_key)
    assert.equal(decrypted_key, d, "decrypted key does not match")
  })

  it("Encrypt", function() {
    var aes = Aes.fromSeed("Password01")
    var d = aes.encryptHex(decrypted_key)
    assert.equal(encrypted_key, d, "encrypted key does not match")
  })
*/

export const readLS = function*() {
    yield takeEvery(actions.LS_READ, function*(action) {
        const { password } = action.payload

        console.log('----------------secureLocalStorage::readLS()', password);

        try {
          let account = JSON.parse(localStorage.getItem('account'));

          console.log('----------------secureLocalStorage::readLS():: account ENCRYPTED:', JSON.stringify(account));

          // let orig = 'hola';
          // let enc = encrypt(orig, password);
          // console.log('PASSWORD:', password, ' PK: ', decrypt('05877cd460b38816b5cd82f54941cd57cb1d613202cef459de01dda1290781c7', password));

          let tmp  = decrypt(account.keys.owner.wif, password)
          console.log(' -- owner', tmp)
          account.keys.owner.wif  = tmp
          tmp = decrypt(account.keys.active.wif, password)
          console.log(' -- acive', tmp)
          account.keys.active.wif = tmp
          tmp = decrypt(account.keys.memo.wif, password)
          console.log(' -- memo', tmp)
          account.keys.memo.wif   = tmp
          account.encrypted = false;
          yield put({ type: actions.LS_READ_SUCCESS, payload: account })
        }
        catch(e) {
          console.log('----------------secureLocalStorage::readLS() ERROR!', e);
          yield put({ type: actions.LS_READ_FAILD })
        }
    })
}

// Decrypt local storage
export const readLS_xxxxx = function*() {
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
        const { keys, account, account_id, password, credentials } = action.payload

        let obj = {
          keys        : keys,
          account     : account,
          account_id  : account_id,
          encrypted   : true
        }
        // console.log(' PLAIN OWNER:', obj.keys.owner.wif)
        obj.keys.owner.wif  = encrypt(obj.keys.owner.wif, password)
        obj.keys.active.wif = encrypt(obj.keys.active.wif, password)
        obj.keys.memo.wif   = encrypt(obj.keys.memo.wif, password)

        // console.log(' ENC OWNER:', obj.keys.owner.wif)
        // console.log(' DEC OWNER:', decrypt(obj.keys.owner.wif, password))


        try {
            const jsonData = JSON.stringify(obj);
            localStorage.setItem('account', jsonData)
            yield put({ type: actions.LS_WRITE_SUCCESS, payload: { plain: jsonData } })
        }
        catch (err) {
            yield put({ type: actions.LS_WRITE_FAILD, payload: err })
        }
    })
}

// Encrypt and write local storage
export const writeLS_XXXXX = function*() {
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
        localStorage.removeItem('account')
        yield put({ type: actions.LS_CLEAN_SUCCESS })
    })
}
