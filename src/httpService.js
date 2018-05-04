import pathToRegexp from 'path-to-regexp';
import { apiConfig } from './config';

// ********************************************************************
// ********************************************************************
// HACK ***************************************************************
import {Signature, ChainStore, FetchChain, PrivateKey, TransactionHelper, Aes, TransactionBuilder, key} from "bitsharesjs";
import {hash, PublicKey, BigInteger, sign, recoverPubKey, verify, calcPubKeyRecoveryParam } from 'bitsharesjs'; // bitsharesjs/lib/ecc/src/signature.js
import {Serializer, ops, sha256 } from 'bitsharesjs'; //'./hash';
import {getCurveByName} from 'ecurve';

export const privKey   = '5JQGCnJCDyraociQmhDRDxzNFCd8WdcJ4BAj8q1YDZtVpk5NDw9';
let pKey        = PrivateKey.fromWif(privKey);
let pubKey      = pKey.toPublicKey().toString();
const chain_id  = '2cfcf449d44f477bc8415666766d2258aa502240cb29d290c1b0de91e756c559';
var secp256k1 = getCurveByName('secp256k1');
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


export const getAndSignTx = (action, parameters, signature) => {
    
  return new Promise( (resolve, reject) => {

    // const url = getPath('URL/SET_OVERDRAFT');
    const url = getPath(action)
    const body = parameters;
    
    console.log( ' SENDING ============= > ' , JSON.stringify(body));
    console.log( ' TO ============= > ' , url);

    fetch(url, {
        method: 'POST',
        headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
        body: JSON.stringify(body)
      })
    .then((response) => response.json()
        , err => {
          console.log(' ===== #1' ,JSON.stringify(err));
          reject(err);
        }) 
      .then((responseJson) => {
        console.log(url, ' ======> ' , JSON.stringify(responseJson));
        
        const push_url = getPath('URL/PUSH_SIGN_TX');
        let tx = responseJson.tx;

        fetch(push_url, {
            method: 'POST',
            headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
            body: JSON.stringify( {tx:tx, pk:signature})
          })
        .then((response) => response.json()
            , err => {
              console.log(' ===== #2' ,JSON.stringify(err));
              reject(err);
        })
        .then((responseJson) => {
          console.log('===========> pushAndSignTX()::res ==> ', JSON.stringify(responseJson));
          resolve(responseJson);
        }, err => {
          console.log(' ===== #3' ,JSON.stringify(err));
          reject(err);
        });

      }, err => {
        console.log(' ===== #4' ,JSON.stringify(err));        
        reject(err);
      })
  });
};


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