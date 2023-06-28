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

// function technically key type agnostic... but naming clash with api store method
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
      modulusLength: 2048,
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
  let keyPair = await generateRSAKeyPair()
  let iv = window.crypto.getRandomValues(new Uint8Array(12));
  let salt = window.crypto.getRandomValues(new Uint8Array(16))
  let wrappingKey = await getWrappingKey(salt, iv, passphrase)
  let wrappedPrivateKey = await wrapRSAKey(iv, keyPair.privateKey, wrappingKey)

  return {
    salt: Buffer.from(salt).toString("base64"),
    iv: Buffer.from(iv).toString("base64"),
    wrappedPrivateKey: new Uint8Array(wrappedPrivateKey),
    publicKey: new Uint8Array(
      await window.crypto.subtle.exportKey('spki', keyPair.publicKey)
    )
  }

  // Convert keys to PEM format
  // let publicKey = await window.crypto.subtle.exportKey('spki', keyPair.publicKey);
  // let privateKey = await window.crypto.subtle.exportKey('pkcs8', keyPair.privateKey);
}

async function encryptRSA(plaintext, publicKey) {
  let encodedplaintext = new TextEncoder().encode(plaintext)

  return window.crypto.subtle.importKey(
    "spki",
    publicKey,
    {
      name: "RSA-OAEP",
      hash: "SHA-256",
    },
    true,
    ["encrypt"]
  ).then((key) => {
    return window.crypto.subtle.encrypt(
      {
        name: "RSA-OAEP"
      },
      key,
      encodedplaintext
    )
  }).then((ciphertext) => {
    return Uint8Array(ciphertext)
  }) 
}

async function decryptRSA(ciphertext, key_params, passphrase) {
  let salt = Buffer.from(key_params.salt, "base64")
  let iv = Buffer.from(key_params.iv, "base64")
  let wrappedPrivateKey = await window.crypto.subtle.importKey("raw", key_params.wrappedPrivateKey, "AES-GCM", true, ["unwrapKey",]);
  let wrappingKey = getWrappingKey(salt, passphrase)
  let privateKey = unwrapRSAKey(iv, wrappedPrivateKey, wrappingKey)

  return window.crypto.subtle.importKey(
    "pkcs8",
    privateKey,
    {
      name: "RSA-OAEP",
      hash: "SHA-256",
    },
    true,
    ["decrypt"]
  ).then((key) => {
      return window.crypto.subtle.decrypt(
        {
          name: "RSA-OAEP"
        },
        key,
        ciphertext
      );
    })
    .then((encodedMSG) => {
      let dec = new TextDecoder();
      return dec.decode(encodedMSG);
    });
}

export { encryptAES, decryptAES, createRSAKeyPair, encryptRSA, decryptRSA };
