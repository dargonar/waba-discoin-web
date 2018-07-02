import pathToRegexp from "path-to-regexp";
import { apiConfig } from "./config";

// ********************************************************************
// ********************************************************************
// HACK ***************************************************************

import {
  Address,
  ChainValidation,
  Signature,
  ChainStore,
  FetchChain,
  PrivateKey,
  TransactionHelper,
  Aes,
  TransactionBuilder,
  key
} from "bitsharesjs";
import {
  Login as login,
  hash,
  PublicKey,
  BigInteger,
  sign,
  recoverPubKey,
  verify,
  calcPubKeyRecoveryParam
} from "bitsharesjs"; // bitsharesjs/lib/ecc/src/signature.js
import { Serializer, ops, sha256 } from "bitsharesjs"; //'./hash';
import { getCurveByName } from "ecurve";
import { ChainConfig } from "bitsharesjs-ws";
// import {bip39} from 'bip39';

export const adminPrivKey =
  "5JQGCnJCDyraociQmhDRDxzNFCd8WdcJ4BAj8q1YDZtVpk5NDw9";
export const adminPubKey =
  "BTS6bM4zBP7PKcSmXV7voEdauT6khCDGUqXyAsq5NCHcyYaNSMYBk";

export const privKey = "5JQGCnJCDyraociQmhDRDxzNFCd8WdcJ4BAj8q1YDZtVpk5NDw9";
export const pubKeyEx = "BTS6bM4zBP7PKcSmXV7voEdauT6khCDGUqXyAsq5NCHcyYaNSMYBk";
let pKey = PrivateKey.fromWif(privKey);
export const pubKey = pKey.toPublicKey().toString();
let account = {
  mnemonics: "",
  wif: "5Jdcks7zmssddSFFJij63xKFKRMH4Rpi192C5u5D5Kp7TRu4eYc",
  owner: "BTS6ewtnzaP7JEGs5RnQtkyG6ESaDHtLJTP6zrgViHBFTDxq2n66Q",
  active: "BTS6ewtnzaP7JEGs5RnQtkyG6ESaDHtLJTP6zrgViHBFTDxq2n66Q",
  memo: "BTS6ewtnzaP7JEGs5RnQtkyG6ESaDHtLJTP6zrgViHBFTDxq2n66Q"
};
const chain_id =
  "2cfcf449d44f477bc8415666766d2258aa502240cb29d290c1b0de91e756c559";
var secp256k1 = getCurveByName("secp256k1");

var bip39 = require("bip39");

// ********************************************************************
// ********************************************************************

export const apiCall = (path, method, data, cb) => {
  // Check if there are any callbacks established
  return () => {
    cb = typeof cb === "function" ? cb : res => res;
    let fetchOptions = {
      method: method || "GET",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json"
      }
    };

    if (typeof data !== "undefined") {
      fetchOptions.body = JSON.stringify(data);
    }

    return fetch(path, fetchOptions)
      .then(res => res.json())
      .then(data => {
        cb(data);
        return { data };
      })
      .catch(ex => ({ data: null, ex }));
  };
};

export const getPath = (action, parameters) => {
  const actions = apiConfig.urls.map(url => ({
    action: url.action,
    getPath: pathToRegexp.compile(url.path)
  }));
  let path = actions
    .filter(act => act.action === action)
    .reduce((pre, act) => act.getPath(parameters), "");

  return apiConfig.base + apiConfig.version + path;
};

export const recoverAccountFromSeed = (mnemonics, is_brainkey) => {
  console.log("MNEMONICS:", mnemonics);
  var seed = bip39.mnemonicToSeedHex(mnemonics, "");
  // let mnemonic_valid = bip39.validateMnemonic(mnemonic,bip39.wordlists.spanish);

  ChainConfig.setPrefix("BTS");

  let myPrivateKey = PrivateKey.fromSeed(seed);
  if (is_brainkey)
    myPrivateKey = PrivateKey.fromSeed(key.normalize_brainKey(seed));
  let myPublicKey = myPrivateKey.toPublicKey().toString("BTS");
  let wif = myPrivateKey.toWif();

  // HACK - No esta recreando WIF como deberia
  wif = adminPrivKey;
  myPublicKey = adminPubKey;
  var ret = {
    master: { wif: wif, pubKey: myPublicKey, privKeyObj: myPrivateKey },
    owner: { wif: wif, pubKey: myPublicKey, privKeyObj: myPrivateKey },
    active: { wif: wif, pubKey: myPublicKey, privKeyObj: myPrivateKey },
    memo: { wif: wif, pubKey: myPublicKey, privKeyObj: myPrivateKey }
  };
  console.log(JSON.stringify({ wif: wif, pubKey: myPublicKey }));
  return ret;
};

export const generateAccount = account_name => {
  // 1) Se valida nombre
  let is_valid_name = ChainValidation.is_account_name(account_name);
  let is_cheap_name = ChainValidation.is_cheap_name(account_name);

  console.log("USERNAME_VALID: ", is_valid_name);
  console.log("USERNAME_CHEAP: ", is_cheap_name);

  let mnemonics = bip39.generateMnemonic(
    128,
    undefined,
    bip39.wordlists.spanish
  );
  mnemonics =
    "lingote colegio bahía altura baba nevera flor triste fauna choza cine áspero";

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

export const subaccountAddOrUpdate = (signature, tx) => {
  const get_tx_url = getPath("URL/NEW_SUBACCOUNT");
  // tx.from_id = business.account_id;
  // let signature = business.wif;

  console.log(" -- subaccountAddOrUpdate::", JSON.stringify(tx));

  return new Promise((resolve, reject) => {
    fetch(get_tx_url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(tx)
    })
      .then(
        response => response.json(),
        err => {
          console.log(" subaccountAddOrUpdate() ===== #1", JSON.stringify(err));
          reject(err);
          return;
        }
      )
      .then(
        responseJson => {
          console.log(
            "===========> subaccountAddOrUpdate()::res #2 ==> ",
            JSON.stringify(responseJson)
          );

          if (typeof responseJson.error !== "undefined") {
            console.log(
              " subaccountAddOrUpdate() ===== #1.5",
              JSON.stringify(responseJson.error)
            );
            reject(responseJson.error);
            return;
          }

          const push_url = getPath("URL/PUSH_SIGN_TX");
          let tx2 = responseJson.tx;
          let packet = { tx: tx2, pk: signature };

          console.log(" ---- A PUNTO DE ADD SUBACCOUNT!!! -> tx2");
          console.log(JSON.stringify(packet));

          fetch(push_url, {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json"
            },
            body: JSON.stringify(packet)
          })
            .then(
              response => response.json(),
              err => {
                console.log(
                  " subaccountAddOrUpdate() ===== #3",
                  JSON.stringify(err)
                );
                reject(err);
                return;
              }
            )
            .then(
              responseJson2 => {
                console.log(
                  "===========> subaccountAddOrUpdate()::res #4 ==> ",
                  JSON.stringify(responseJson2)
                );
                console.log(" == subaccountAddOrUpdate() :: resolving!!!!!!!!");
                resolve(responseJson2);
                return;
              },
              err => {
                console.log(
                  " subaccountAddOrUpdate() ===== #5",
                  JSON.stringify(err)
                );
                reject(err);
                return;
              }
            );
        },
        err => {
          console.log(" rewardCustomer() ===== #6", JSON.stringify(err));
          reject(err);
          return;
        }
      );
  });
};

export const rewardCustomer = (signature, tx) => {
  const get_tx_url = getPath("URL/REFUND_CREATE");
  // tx.from_id = business.account_id;
  // let signature = business.wif;

  console.log(" -- rewardCustomer::", JSON.stringify(tx));

  return new Promise((resolve, reject) => {
    fetch(get_tx_url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(tx)
    })
      .then(
        response => response.json(),
        err => {
          console.log(" rewardCustomer() ===== #1", JSON.stringify(err));
          reject(err);
          return;
        }
      )
      .then(
        responseJson => {
          console.log(
            "===========> rewardCustomer()::res #2 ==> ",
            JSON.stringify(responseJson)
          );

          const push_url = getPath("URL/PUSH_SIGN_TX");
          let tx2 = responseJson.tx;
          let packet = { tx: tx2, pk: signature };

          console.log(" ---- A PUNTO DE RECOMPENSAR!!! -> tx2");
          console.log(JSON.stringify(packet));

          fetch(push_url, {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json"
            },
            body: JSON.stringify(packet)
          })
            .then(
              response => response.json(),
              err => {
                console.log(" rewardCustomer() ===== #3", JSON.stringify(err));
                reject(err);
                return;
              }
            )
            .then(
              responseJson2 => {
                console.log(
                  "===========> rewardCustomer()::res #4 ==> ",
                  JSON.stringify(responseJson2)
                );
                console.log(" == rewardCustomer() :: resolving!!!!!!!!");
                resolve(responseJson2);
                return;
              },
              err => {
                console.log(" rewardCustomer() ===== #5", JSON.stringify(err));
                reject(err);
                return;
              }
            );
        },
        err => {
          console.log(" rewardCustomer() ===== #6", JSON.stringify(err));
          reject(err);
          return;
        }
      );
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
