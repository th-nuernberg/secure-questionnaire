# Encryption

## RSA


```javascript
/**
 * Imports rsa public key from string and ciphertext. Returns encrypted ciphertext.
 *
 * @param {string} ciphertext - text to encrypt 
 * @param {string} rsa_pub_key - hast to be in spki: SubjectPublicKeyInfo format. 
 * @returns {Uint8Array} encrypted_ciphertext
 */
 
async function ecnryptRSA(rsa_pub_key, ciphertext){
  ...
  return encrypted_ciphertext
}
```
