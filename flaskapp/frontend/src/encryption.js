// AES Encryption and Decryption

async function encryptAES(message) {
  let iv = window.crypto.getRandomValues(new Uint8Array(12));
  let key = await generateAESKey();
  let encoded = getMessageEncoding(message);

  let ciphertext = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    encoded
  );
  let rawkey = await crypto.subtle.exportKey("raw", key);

  return {
    Key: new Uint8Array(rawkey),
    Cipher: new Uint8Array(ciphertext),
    IV: iv,
  };
}

function generateAESKey() {
  return window.crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"]
  );
}

function getMessageEncoding(message) {
  let enc = new TextEncoder();
  return enc.encode(message);
}

async function decryptAES(key, cipher, iv) {
  return importAESKey(key)
    .then((keyobj) => {
      return window.crypto.subtle.decrypt(
        {
          name: "AES-GCM",
          iv: iv,
        },
        keyobj,
        cipher
      );
    })
    .then((encodedMSG) => {
      let dec = new TextDecoder();
      return dec.decode(encodedMSG);
    });
}

function importAESKey(key) {
  return window.crypto.subtle.importKey("raw", key, "AES-GCM", true, [
    "decrypt",
  ]);
}

async function getWrappingKey(salt, passphrase) {
  let keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(passphrase),
    "PBKDF2",
    false,
    ["deriveKey"]
  )

  return window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { 
      name: "AES-GCM", 
      length: 256 
    },
    true,
    ["wrapKey", "unwrapKey"]
  )
}

// function technically key type agnostic... but naming clash with api
async function wrapRSAKey(iv, privateKey, wrappingKey) {
  return window.crypto.subtle.wrapKey(
    "pkcs8", 
    privateKey, 
    wrappingKey, 
    {
      name: "AES-GCM",
      iv: iv,
    }
  )
}

async function unwrapRSAKey(iv, wrappedPrivateKey, wrappingKey) {
  return window.crypto.subtle.unwrapKey(
    "pkcs8",
    wrappedPrivateKey,
    wrappingKey,
    {
      name: "AES-GCM",
      iv: iv,
    },
    {
      name: "RSA-OAEP",
      hash: "SHA-256",
    },
    true,
    ["decrypt"]
  )
}

async function generateRSAKeyPair() {
  let keyPair = await window.crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 4096,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["encrypt", "decrypt"]
  );

  return {
    privateKey: keyPair.privateKey,
    publicKey: keyPair.publicKey
  }
}

async function createRSAKeyPair(passphrase) {
  const keyPair = await generateRSAKeyPair()
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const salt = window.crypto.getRandomValues(new Uint8Array(16))
  const wrappingKey = await getWrappingKey(salt, iv, passphrase)
  
  let wrappedPrivateKey = await wrapRSAKey(iv, keyPair.privateKey, wrappingKey)
  
  // --- test -----
  let plaintext = "General Kenobi"
  let ciphertext = await encryptRSA(plaintext, keyPair.publicKey)
  let privateKey = await unwrapRSAKey(iv, wrappedPrivateKey, wrappingKey)
  let decryptedCiphertext = await decryptRSA(ciphertext, privateKey)
  console.log(new TextDecoder().decode(decryptedCiphertext))
  // --- test -----
  

  return {
    salt: Buffer.from(salt).toString("base64"),
    iv: Buffer.from(iv).toString("base64"),
    wrappedPrivateKey: wrappedPrivateKey,
    publicKey: keyPair.publicKey
  }

  // Convert keys to PEM format
  // let publicKey = await window.crypto.subtle.exportKey('spki', keyPair.publicKey);
  // let privateKey = await window.crypto.subtle.exportKey('pkcs8', keyPair.privateKey);
}

async function encryptRSA(plaintext, publicKey) {
  let encodedplaintext = new TextEncoder().encode(plaintext)
  let ciphertext = window.crypto.subtle.encrypt(
    {
      name: "RSA-OAEP"
    },
    publicKey,
    encodedplaintext
  )

  return Uint8Array(ciphertext)
}

async function decryptRSA(ciphertext, key_params, passphrase) {
  let salt = Buffer.from(key_params.salt, "base64")
  let iv = Buffer.from(key_params.iv, "base64")
  let wrappedPrivateKey = key_params.wrappedPrivateKey
  let wrappingKey = getWrappingKey(salt, passphrase)

  // TODO: CS: Funktioniert zwar? aber lieber ueber import/export gehen als mit den rohen KeyObjects zu hantieren...

  let privateKey = unwrapRSAKey(iv, wrappedPrivateKey, wrappingKey)

  return window.crypto.subtle.decrypt(
    { 
      name: "RSA-OAEP" 
    },
    privateKey,
    ciphertext
  )
}


export { encryptAES, decryptAES, createRSAKeyPair, encryptRSA, decryptRSA };
