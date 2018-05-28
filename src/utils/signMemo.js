import { buf2hex } from './buf2hex';
import { PrivateKey, Aes } from "bitsharesjs";
import { ChainConfig } from 'bitsharesjs-ws';

export const signMemo = (memoToKey, memo, account) => {

    let nonce    = 0;
    let myPKey   = PrivateKey.fromWif(account.memo.wif);
    ChainConfig.setPrefix("BTS");

    const buffer = Aes.encrypt_with_checksum(
        myPKey,
        memoToKey,
        nonce,
        memo
    );
      
    const memo_object = {
        from: account.memo.pubKey,
        to: memoToKey,
        nonce: 0,
        message: buf2hex(buffer.buffer)
    }

    return memo_object;
  }    
  