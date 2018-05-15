import pathToRegexp from 'path-to-regexp';
import { apiConfig } from './config';

// ********************************************************************
// ********************************************************************
// HACK ***************************************************************

import {Address, ChainValidation, Signature, ChainStore, FetchChain, PrivateKey, TransactionHelper, Aes, TransactionBuilder, key} from "bitsharesjs";
import {Login as login, hash, PublicKey, BigInteger, sign, recoverPubKey, verify, calcPubKeyRecoveryParam } from 'bitsharesjs'; // bitsharesjs/lib/ecc/src/signature.js
import {Serializer, ops, sha256 } from 'bitsharesjs'; //'./hash';
import {getCurveByName} from 'ecurve';
import {ChainConfig} from "bitsharesjs-ws";
// import {bip39} from 'bip39';

export const adminPrivKey = '5JQGCnJCDyraociQmhDRDxzNFCd8WdcJ4BAj8q1YDZtVpk5NDw9';
export const adminPubKey  = 'BTS6bM4zBP7PKcSmXV7voEdauT6khCDGUqXyAsq5NCHcyYaNSMYBk'

export const privKey    = '5JQGCnJCDyraociQmhDRDxzNFCd8WdcJ4BAj8q1YDZtVpk5NDw9';
export const pubKeyEx   = 'BTS6bM4zBP7PKcSmXV7voEdauT6khCDGUqXyAsq5NCHcyYaNSMYBk'
let pKey                = PrivateKey.fromWif(privKey);
export const pubKey     = pKey.toPublicKey().toString();
let account = {
      mnemonics : '',
      wif       : '5Jdcks7zmssddSFFJij63xKFKRMH4Rpi192C5u5D5Kp7TRu4eYc',
      owner     : 'BTS6ewtnzaP7JEGs5RnQtkyG6ESaDHtLJTP6zrgViHBFTDxq2n66Q',
      active    : 'BTS6ewtnzaP7JEGs5RnQtkyG6ESaDHtLJTP6zrgViHBFTDxq2n66Q',
      memo      : 'BTS6ewtnzaP7JEGs5RnQtkyG6ESaDHtLJTP6zrgViHBFTDxq2n66Q'
    };
const chain_id          = '2cfcf449d44f477bc8415666766d2258aa502240cb29d290c1b0de91e756c559';
var secp256k1           = getCurveByName('secp256k1');

var bip39 = require('bip39')
var HDKey = require('hdkey')



// ********************************************************************
// ********************************************************************

export const apiCall = (path, method, data, cb) => {
    // Check if there are any callbacks established
    return () => {
        cb = (typeof cb === 'function')? cb: (res)=>res;
        let fetchOptions = {
            method: method || 'GET',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            }
        }

        if (typeof data !== 'undefined') {
            fetchOptions.body = JSON.stringify(data);
        }

        return fetch( path, fetchOptions)
        .then(res => res.json() )
        .then(data => {
            cb(data)
            return { data };
        })
        .catch(ex => ({ data: null, ex }));
    };
};

export const getPath = (action, parameters) => {
    const actions = apiConfig.urls.map(url => ({ action:url.action, getPath: pathToRegexp.compile(url.path) }))
    let path = actions
        .filter(act => act.action === action)
        .reduce((pre,act) => act.getPath(parameters),'')

    return apiConfig.base + apiConfig.version + path;
};


// export const getAndSignTx = (action, parameters, signature) => {
    
//   return new Promise( (resolve, reject) => {

//     // const url = getPath('URL/SET_OVERDRAFT');
//     const url = getPath(action)
//     const body = parameters;
    
//     console.log( ' SENDING ============= > ' , JSON.stringify(body));
//     console.log( ' TO ============= > ' , url);

//     fetch(url, {
//         method: 'POST',
//         headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
//         body: JSON.stringify(body)
//       })
//     .then((response) => response.json()
//         , err => {
//           console.log(' ===== #1' ,JSON.stringify(err));
//           reject(err);
//         }) 
//       .then((responseJson) => {
//         console.log(url, ' ======> ' , JSON.stringify(responseJson));
        
//         const push_url = getPath('URL/PUSH_SIGN_TX');
//         let tx = responseJson.tx;

//         fetch(push_url, {
//             method: 'POST',
//             headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
//             body: JSON.stringify( {tx:tx, pk:signature})
//           })
//         .then((response) => response.json()
//             , err => {
//               console.log(' ===== #2' ,JSON.stringify(err));
//               reject(err);
//         })
//         .then((responseJson) => {
//           console.log('===========> pushAndSignTX()::res ==> ', JSON.stringify(responseJson));
//           resolve(responseJson);
//         }, err => {
//           console.log(' ===== #3' ,JSON.stringify(err));
//           reject(err);
//         });

//       }, err => {
//         console.log(' ===== #4' ,JSON.stringify(err));        
//         reject(err);
//       })
//   });
// };



export const recoverAccountFromSeed = (mnemonics, is_brainkey) => {

  console.log('MNEMONICS:', mnemonics); 
  var seed  = bip39.mnemonicToSeedHex(mnemonics, '');
  // let mnemonic_valid = bip39.validateMnemonic(mnemonic,bip39.wordlists.spanish);
  
  ChainConfig.setPrefix("BTS");

  let myPrivateKey  = PrivateKey.fromSeed(seed);
  if(is_brainkey)
    myPrivateKey = PrivateKey.fromSeed( key.normalize_brainKey(seed) );
  let myPublicKey   = myPrivateKey.toPublicKey().toString("BTS");
  let wif           = myPrivateKey.toWif();

  // HACK - No esta recreando WIF como deberia
  wif         = adminPrivKey;
  myPublicKey = adminPubKey;
  var ret = {
    master:   { wif:wif, pubKey:myPublicKey, privKeyObj: myPrivateKey},
    owner:    { wif:wif, pubKey:myPublicKey, privKeyObj: myPrivateKey},
    active:   { wif:wif, pubKey:myPublicKey, privKeyObj: myPrivateKey},
    memo:     { wif:wif, pubKey:myPublicKey, privKeyObj: myPrivateKey}
  }
  console.log(JSON.stringify({wif:wif, pubKey:myPublicKey}));
  return ret;
}
export const recoverAccountFromSeed_HDKEY = (mnemonics) => {

  console.log('MNEMONICS:', mnemonics); 
  var seed = bip39.mnemonicToSeed(mnemonics, '');
  var hdkey = HDKey.fromMasterSeed(new Buffer(seed, 'hex'))
  console.log(' hdkey.toJSON().xpriv: ', hdkey.toJSON().xpriv);
  // let mnemonic_valid = bip39.validateMnemonic(mnemonic,bip39.wordlists.spanish);
  let wif = hdkey.privateKey.toString('hex');

  ChainConfig.setPrefix("BTS");
  let myPrivateKey = PrivateKey.fromWif(wif);
  let myPublicKey  = pKey.toPublicKey().toString("BTS");

  var ret = {
    master:   { wif:wif, pubKey:myPublicKey, privKeyObj: myPrivateKey},
    owner:    { wif:wif, pubKey:myPublicKey, privKeyObj: myPrivateKey},
    active:   { wif:wif, pubKey:myPublicKey, privKeyObj: myPrivateKey},
    memo:     { wif:wif, pubKey:myPublicKey, privKeyObj: myPrivateKey}
  }

  
  
  // // var childkey1 = hdkey.derive("m/0/0'/1")
  // // var childkey2 = hdkey.derive("m/0/0'/2")
  // // var childkey3 = hdkey.derive("m/0/0'/3")

  // var childkey1 = hdkey.derive("44/0/0'/1")
  // var childkey2 = hdkey.derive("44/0/0'/2")
  // var childkey3 = hdkey.derive("44/0/0'/3")

  // ChainConfig.setPrefix("BTS");
  
  // let addy = Address.fromBuffer(childkey1.publicKey).toString();

  // console.log('addy:', addy)
  // var ret = {
  //   master:   {raw:hdkey, privKey:hdkey.privateKey.toString('hex'), pubKey:hdkey.publicKey.toString('hex')},
  //   owner:    {raw:childkey1, privKey:childkey1.privateKey.toString('hex'), pubKey:childkey1.publicKey.toString('hex')},
  //   active:   {raw:childkey2, privKey:childkey2.privateKey.toString('hex'), pubKey:childkey2.publicKey.toString('hex')},
  //   memo:     {raw:childkey3, privKey:childkey3.privateKey.toString('hex'), pubKey:childkey3.publicKey.toString('hex')}
  // }
  
  console.log(JSON.stringify(ret));
  return ret;
};

export const generateAccount = (account_name) => {
  
  // 1) Se valida nombre 
  let is_valid_name = ChainValidation.is_account_name(account_name);
  let is_cheap_name = ChainValidation.is_cheap_name(account_name);
  
  console.log('USERNAME_VALID: ', is_valid_name);
  console.log('USERNAME_CHEAP: ', is_cheap_name);

  let mnemonics     = bip39.generateMnemonic(128, undefined, bip39.wordlists.spanish);
  mnemonics = 'lingote colegio bahía altura baba nevera flor triste fauna choza cine áspero';
  
  return recoverAccountFromSeed(mnemonics);
  
  // UWCrypto.generateMnemonic('es', 128).then(function(res1) {
  // UWCrypto.mnemonicToMasterKey(res1.mnemonic).then(function(res2) {
  //    UWCrypto.derivePrivate('', '', res2.masterPrivateKey, 1),
  //    UWCrypto.derivePrivate('', '', res2.masterPrivateKey, 2),
  //    UWCrypto.derivePrivate('', '', res2.masterPrivateKey, 3)


  // const supersecret = 'supersecret' + (new Date().getTime()).toString();
  // let keys = login.generateKeys(account_name, supersecret);
  // console.log(keys);
  // return keys;
  
};    
  
function buf2hex(buffer) { // buffer is an ArrayBuffer
  return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
}


export const signMemo = (memoToKey, memo, account) => {

  let nonce       = 0;
  let myPKey      = PrivateKey.fromWif(account.memo.wif);

  ChainConfig.setPrefix("BTS");
  const buffer = Aes.encrypt_with_checksum(
          myPKey,
          memoToKey,
          nonce,
          memo
      );
  console.log(buf2hex(buffer.buffer)); // = 04080c10

  let memo_object = {
      from: account.memo.pubKey,
      to: memoToKey,
      nonce: 0,
      message: buf2hex(buffer.buffer)
  }
  console.log(' ======================== > MEMO');
  console.log(JSON.stringify(memo_object));
  return memo_object;
}    

export const bizLogin = (account_name, mnemonics, is_brainkey) => {
  
  const push_url  = getPath('URL/BIZ_LOGIN', {account_name:account_name});
  let account     = recoverAccountFromSeed(mnemonics, is_brainkey);
  // TINNERY COILING BRAISE ABRASE OPPOSER OUTWENT TAXATOR CHERRY KISWA MATEY LINO EUGE AXUNGE STIPE RICKEY SAMOVAR
  
  return new Promise( (resolve, reject) => {
    fetch(push_url, {
        method: 'GET',
        headers: {'Accept': 'application/json', 'Content-Type': 'application/json'}
      })
    .then((response) => response.json()
        , err => {
          console.log(' bizLogin() ===== #1' ,JSON.stringify(err));
          reject(err);
          return;
    })
    .then((responseJson) => {
      console.log('===========> bizLogin()::res #2 ==> ', JSON.stringify(responseJson));
      
      let secret            = responseJson.secret;
      let destintation_key  = responseJson.destintation_key; 
      let memo_obj          = signMemo(destintation_key, secret, account);
      memo_obj['signed_secret'] = memo_obj.message;

      fetch(push_url, {
        method: 'POST',
        headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
        body: JSON.stringify( memo_obj )
        })
      .then((response) => response.json()
        , err => {
          console.log(' bizLogi()n ===== #3' ,JSON.stringify(err));
          reject(err);
          return;
      })
      .then((responseJson2) => {
        console.log('===========> bizLogin()::res #4 ==> ', JSON.stringify(responseJson2));
        console.log(' == bizLogin() :: resolving!!!!!!!!');
        resolve(responseJson2);
        return;
      }, err => {
        console.log(' bizLogin() ===== #5' ,JSON.stringify(err));
        reject(err);
        return;
      });

    }, err => {
      console.log(' bizLogin() ===== #6' ,JSON.stringify(err));
      reject(err);
      return;
    });
  });
}

// ********************************************************************
// ********************************************************************

/*
// HOW TO USE:

//1. Set your api configutarion:
const apiConfig = {
    base: 'http://localhost/',
    verion: 'v1',
    urls: [{action:'test', patch: '/test/:id}]
};

//2. Build your path:
const testPath = getPath('test', {id: 1234}); //-> 'http://localhost/v1/test/1234'

//3. Get your call function:
const callTestAPI = apiCall(testPath)

//4. Execute!
callTestAPI() //-> return Promise

// Anothers examples: 

// POST
apiCall(testPath, 'POST', {name: 'marcos'})()

// SECUNDARY CALLBACK
// apiCall returns a promise but you can also run an additional callback.
apiCall(testPath, 'POST', {name: 'marcos'}, (res) => {console.log('RESPONSE', res)})
apiCall(testPath, 'GET', undefined, (res) => {console.log('RESPONSE', res)})

*/