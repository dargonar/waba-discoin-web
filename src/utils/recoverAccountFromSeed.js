import { PrivateKey, key } from "bitsharesjs";
import { ChainConfig } from 'bitsharesjs-ws';
import  bip39 from 'bip39';


// HACK - Remove hardcoded keys
// export const adminPrivKey = '5JQGCnJCDyraociQmhDRDxzNFCd8WdcJ4BAj8q1YDZtVpk5NDw9';
// export const adminPubKey  = 'BTS6bM4zBP7PKcSmXV7voEdauT6khCDGUqXyAsq5NCHcyYaNSMYBk'

export const adminPrivKey = '5Kjz35R9W3m5ZpznZMSpdySz35tZsXZbzsuSdbtV12YC9Zaxzd9';
export const adminPubKey  = 'BTS5NQUTrdEgKH4fz5L5DLJZBSkdLWUY4CfnaNZ77yvZAnUZNC89d'

// ToDo: cambiar a recoverKeysFromSeed
export const recoverAccountFromSeed = (mnemonics, is_brainkey) => {

    // const seed  = bip39.mnemonicToSeedHex(mnemonics, '');

    // ChainConfig.setPrefix("BTS");

    // let myPrivateKey  = PrivateKey.fromSeed(seed);

    // console.log('recoverAccountFromSeed::is_brainkey:', is_brainkey)
    // if(is_brainkey)
    // {
    //   myPrivateKey = PrivateKey.fromSeed( key.normalize_brainKey(seed) );
    // }

    let myPrivateKey = PrivateKey.fromSeed( key.normalize_brainKey(mnemonics) );

    let myPublicKey   = myPrivateKey.toPublicKey().toString("BTS");
    let wif           = myPrivateKey.toWif();

    // HACK - No esta recreando WIF como deberia
    // wif         = adminPrivKey;
    // myPublicKey = adminPubKey;

    const keys = {
      // master:   { wif:wif, pubKey:myPublicKey},
      owner:    { wif:wif, pubKey:myPublicKey},
      active:   { wif:wif, pubKey:myPublicKey},
      memo:     { wif:wif, pubKey:myPublicKey}
    }

    return keys;

}
