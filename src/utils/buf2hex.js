import { Aes } from 'bitsharesjs';

export function buf2hex(buffer) { // buffer is an ArrayBuffer
    return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
}

export function a2hex(str) {
  var arr = [];
  for (var i = 0, l = str.length; i < l; i ++) {
    var hex = Number(str.charCodeAt(i)).toString(16);
    arr.push(hex);
  }
  return arr.join('');
}

export function hex2a(hexx) {
    var hex = hexx.toString();//force conversion
    var str = '';
    for (var i = 0; i < hex.length; i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
}

export function encrypt(text, password){
    var aes = Aes.fromSeed(password)
    return aes.encryptHex(a2hex(text));
}

export function decrypt(text, password){
  var aes = Aes.fromSeed(password);
  return hex2a(aes.decryptHex(text));

}
