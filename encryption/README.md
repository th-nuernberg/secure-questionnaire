# Encryption

Functions for encryption and decryption with AES and RSA in sript.js.
For more detailed information see:
https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto

## RSA

Encryption:

```javascript
/**
 * Imports rsa public key from string. Returns encrypted ciphertext.
 *
 * @param {string} ciphertext - text to encrypt 
 * @param {string} rsa_pub_key - hast to be in spki: SubjectPublicKeyInfo format. 
 * @returns {Uint8Array} encrypted_ciphertext
 */
 
async function encryptRSA(rsa_pub_key, ciphertext){
  ...
  return encrypted_ciphertext
}
```
Decryption:

```javascript
/**
 * Imports rsa privat key from string. Returns decrypted ciphertext.
 *
 * @param {Uint8Array} ciphertext - text to decrypt 
 * @param {string} rsa_priv_key - hast to be in pkcs8 format. 
 * @returns {string} decrypted ciphertext
 */
 
async function decryptRSA(rsa_priv_key, ciphertext){
  ...
  return decrypted_ciphertext
}
```
Use "generateRSAkeys.py" to generate keys.
See example.html 75-100.

## AES
Encryption:

```javascript
/**
 * Generates a symmetric AES-key. Returns encrypted ciphertext, initialization vector and AES-key in raw format.
 *
 * @param {string} ciphertext - text to encrypt 
 * @returns {Object( {Uint8Array} Key - key used to encrypt ciphertext
 *                   {Uint8Array} Ciphertext - ciphertext to encryot
 *                   {Uint8Array} IV - inistalising vector used to encrypt cipher 
 * )} object containing key, encrypted ciphertext and initialization vector
 */
 
async function encryptAES(ciphertext){
  ...
  return {'Key': key , 'Cipher': encrypted_ciphertext 'IV': iv}
}
```
Decryption:

```javascript
/**
 * Decrypts AES encrypted ciphertext using key and initialization vecotr
 *
 * @param {Uint8Array} key - AES Key to decrypt with
 * @param {Uint8Array} ciphertext - text to decrypt 
 * @param {Uint8Array} iv - initialization vector
 * @returns {string} decrypted ciphertext
 */
 
async function decryptAES(key, ciphertext, iv){
  ...
  return decrypted_ciphertext
}
```

## QR-Code

Generation:

Scripts for QR-Code Generation in qrcode.js.

```html
<div id=qrcode style="width: 800;"></div>
```
```javascript
var qrcode = new QRCode(document.getElementById('qrcode')); 

qrcode.makeCode("This text is going to be decoded as QR-Code")
```

Reader:

Scripts for QR-Reader in html5-qrcode.min.js.

```html
<div id="qr-reader" style="width:500px"></div>
<p id="qr-reader-results"></p>
```
```javascript
function onScanSuccess(decodedText, decodedResult){
    let resultContainer = document.getElementById('qr-reader-results');
    resultContainer.textContent = decodedText
}
  var html5QrcodeScanner = new Html5QrcodeScanner("qr-reader", { fps: 10, qrbox: 250 });
  html5QrcodeScanner.render(onScanSuccess);
```
