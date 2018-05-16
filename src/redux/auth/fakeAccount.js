// ********************************************************************
// ********************************************************************
// HACK ***************************************************************
import {Signature, ChainStore, FetchChain, PrivateKey, TransactionHelper, Aes, TransactionBuilder, key} from "bitsharesjs";
import {hash, PublicKey, BigInteger, sign, recoverPubKey, verify, calcPubKeyRecoveryParam } from 'bitsharesjs'; // bitsharesjs/lib/ecc/src/signature.js
import {Serializer, ops, sha256 } from 'bitsharesjs'; //'./hash';
import {getCurveByName} from 'ecurve';
export const privKey   = '5JQGCnJCDyraociQmhDRDxzNFCd8WdcJ4BAj8q1YDZtVpk5NDw9';
// ********************************************************************
// ********************************************************************

export const getKeys = (password) => {
    return Promise.resolve({
        keys: {
            privKey: password || privKey,
            pubKey: PrivateKey.fromWif(password || privKey),
            chain_id: '2cfcf449d44f477bc8415666766d2258aa502240cb29d290c1b0de91e756c559',
            secp256k1: getCurveByName('secp256k1')
        },
        err: false
    })
}