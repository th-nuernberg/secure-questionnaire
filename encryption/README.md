# Encryption

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
 * @returns {Object( {Uint8Array} Key,
 *                   {Uint8Array} Ciphertext,
 *                   {Uint8Array} IV
 * )} object containing key, encrypted ciphertext
 */
 
async function encryptAES(ciphertext){
  ...
  return {'Key': key , 'Cipher': encrypted_ciphertext 'IV': iv}
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
