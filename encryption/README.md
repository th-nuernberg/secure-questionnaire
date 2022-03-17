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
