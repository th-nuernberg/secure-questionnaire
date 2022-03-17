# Encryption

## RSA

Encryption:

```javascript
/**
 * Imports rsa public key from string and ciphertext. Returns encrypted ciphertext.
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
 * Imports rsa privat key from string and rsa encrypted ciphertext. Returns decrypted ciphertext.
 *
 * @param {Uint8Array} ciphertext - text to decrypt 
 * @param {string} rsa_priv_key - hast to be in spki: SubjectPublicKeyInfo format. 
 * @returns {string} encrypted ciphertext
 */
 
async function decryptRSA(rsa_priv_key, ciphertext){
  ...
  return decrypted_ciphertext
```



