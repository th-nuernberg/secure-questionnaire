# Encryption

Function for encryption and decryption with AES and RSA in sript.js.
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

## AES
Encryption:

```javascript
/**
 * Generates a symmetric AES-key. Returns encrypted ciphertext, initialising vector and AES-key in raw format.
 *
 * @param {string} ciphertext - text to encrypt 
 * @returns {Object( {Uint8Array} Key - key used to encrypt ciphertext
 *                   {Uint8Array} Ciphertext - ciphertext to encryot
 *                   {Uint8Array} IV - inistalising vector used to encrypt cipher 
 * )} object containing key, encrypted ciphertext and initialsing vector
 */
 
async function encryptAES(ciphertext){
  ...
  return {'Key': key , 'Cipher': encrypted_ciphertext 'IV': iv}
}
```
Decryption:

```javascript
/**
 * Decrypts AES encrypted ciphertext using key and initalising vecotr
 *
 * @param {Uint8Array} key - AES Key to decrypt with
 * @param {Uint8Array} ciphertext - text to decrypt 
 * @param {Uint8Array} iv - inistalising vector
 * @returns {string} decrypted ciphertext
 */
 
async function decryptAES(key, ciphertext, iv){
  ...
  return decrypted_ciphertext
}
```
