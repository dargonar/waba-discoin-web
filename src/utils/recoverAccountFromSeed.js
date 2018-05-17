import { PrivateKey, key } from "bitsharesjs";
import { ChainConfig } from 'bitsharesjs-ws';
import  bip39 from 'bip39';


// HACK - Remove hardcoded keys
export const adminPrivKey = '5JQGCnJCDyraociQmhDRDxzNFCd8WdcJ4BAj8q1YDZtVpk5NDw9';
export const adminPubKey  = 'BTS6bM4zBP7PKcSmXV7voEdauT6khCDGUqXyAsq5NCHcyYaNSMYBk'

export const recoverAccountFromSeed = (mnemonics, is_brainkey) => {

    const seed  = bip39.mnemonicToSeedHex(mnemonics, '');
    
    ChainConfig.setPrefix("BTS");

    let myPrivateKey  = PrivateKey.fromSeed(seed);
    
    if(is_brainkey)
      myPrivateKey = PrivateKey.fromSeed( key.normalize_brainKey(seed) );

    let myPublicKey   = myPrivateKey.toPublicKey().toString("BTS");
    let wif           = myPrivateKey.toWif();
  
    // HACK - No esta recreando WIF como deberia
    wif         = adminPrivKey;
    myPublicKey = adminPubKey;

    const ret = {
      master:   { wif:wif, pubKey:myPublicKey, privKeyObj: myPrivateKey},
      owner:    { wif:wif, pubKey:myPublicKey, privKeyObj: myPrivateKey},
      active:   { wif:wif, pubKey:myPublicKey, privKeyObj: myPrivateKey},
      memo:     { wif:wif, pubKey:myPublicKey, privKeyObj: myPrivateKey}
    }

    return ret;

}