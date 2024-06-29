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

async function getWrappingKey(passphrase, salt) {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(passphrase),
    { name: "PBKDF2"},
    false,
    ["deriveBits", "deriveKey"]
  ).then((keyMaterial) => {
    return crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        hash: "SHA-256",
        salt,
        iterations: 100000,
      },
      keyMaterial,
      { 
        name: "AES-GCM", 
        length: 256 
      },
      true,
      ["encrypt", "decrypt", "wrapKey", "unwrapKey"]
    )
  })
}

// TODO: move to utils

function b64ToBn(b64) {
  const bin = atob(b64);
  const hex = [];

  bin.split('').forEach(function (ch) {
      let h = ch.charCodeAt(0).toString(16);
      if (h.length % 2) { h = '0' + h; }
      hex.push(h);
   });

   return BigInt('0x' + hex.join(''));
}

function urlBase64ToBase64(str) {
  const r = str % 4;
  if (2 === r) {
      str += '==';
  } else if (3 === r) {
      str += '=';
  }
  return str.replace(/-/g, '+').replace(/_/g, '/');
}

function base64urlDecode(base64url) {
  return b64ToBn(urlBase64ToBase64(base64url));
}

async function createRSAKeyPair(passphrase) {
  const wrappingIv = crypto.getRandomValues(new Uint8Array(12))
  let salt = window.crypto.getRandomValues(new Uint8Array(16))

  let keyPair = await crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      hash: "SHA-256",
      publicExponent: new Uint8Array([1, 0, 1]),
      modulusLength: 2048
    },
    true,
    ["encrypt", "decrypt"]
  );

  let wrappingKey = await getWrappingKey(passphrase, salt)
  let wrappedPrivateKey = await crypto.subtle.wrapKey(
    "jwk", 
    keyPair.privateKey, 
    wrappingKey, 
    {
      name: "AES-GCM",
      length: 256,
      iv: wrappingIv,
    }
  )

  console.log(Buffer.from("").toString("base64"))


  let publicKeyJWK = await crypto.subtle.importKey(
    "spki",
    await crypto.subtle.exportKey('spki', keyPair.publicKey),
    {
      name: "RSA-OAEP",
      hash: "SHA-256",
    },
    true,
    ["encrypt"]
  ).then((key) => {
    return crypto.subtle.exportKey("jwk", key)
    // new Uint8Array(
    //   crypto.subtle.exportKey("jwk", key)
    // )
  })

  // base64urluint encoded exponent to bigint
  let publicExponent = base64urlDecode(publicKeyJWK.n)

  // TODO: public exponent in DB rather than key bytes; then reconstruct public key in frontend after retreiving exponent from backend

  return {
    wrappedPrivateKey: new Uint8Array(wrappedPrivateKey),
    publicKey: new Uint8Array(
      await crypto.subtle.exportKey('spki', keyPair.publicKey)
    ),
    publicExponent: publicExponent,
    salt: salt,
    wrappingIv: wrappingIv,
  }
}

async function encryptRSA(plaintext, publicKey) {
  let encodedplaintext = new TextEncoder().encode(plaintext)

  return crypto.subtle.importKey(
    "spki",
    publicKey,
    {
      name: "RSA-OAEP",
      hash: "SHA-256",
    },
    true,
    ["encrypt"]
  ).then((key) => {
    return crypto.subtle.encrypt(
      { name: "RSA-OAEP" },
      key,
      encodedplaintext
    )
  }).then((ciphertext) => {
    return new Uint8Array(ciphertext)
  }) 
}

async function decryptRSA(ciphertext, key_params, passphrase) {
  let wrappingKey = await getWrappingKey(passphrase, key_params.salt)
  let privateKey = await crypto.subtle.unwrapKey(
    "jwk", 
    key_params.wrappedPrivateKey, 
    wrappingKey, 
    {
      name: "AES-GCM",
      length: 256,
      iv: key_params.wrappingIv,
    }, 
    {
      name: "RSA-OAEP",
      hash: "SHA-256",
      publicExponent: new Uint8Array([1, 0, 1]),
      modulusLength: 2048
    }, 
    true, 
    ["decrypt"]
  )
  let decrypted = await crypto.subtle.decrypt(
      { name: "RSA-OAEP" },
      privateKey,
      ciphertext
  )

  return new TextDecoder().decode(decrypted);
}

export { encryptAES, decryptAES, createRSAKeyPair, encryptRSA, decryptRSA };
