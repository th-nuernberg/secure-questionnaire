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

// RSA encryption/decryption

async function generateRSAKeyPair(passphrase) {
  // TODO: CS: crypto web api does not allow passphrase input directely into key generation, so do a little extra work
  // easer alternative: use external library dependency...

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

  // Convert keys to PEM format
  let publicKey = await window.crypto.subtle.exportKey('spki', keyPair.publicKey);
  let privateKey = await window.crypto.subtle.exportKey('pkcs8', keyPair.privateKey);

  let body = window.btoa(String.fromCharCode(...new Uint8Array(privateKey)));
  body = body.match(/.{1,64}/g).join('\n');

  return {
    publicKey: `-----BEGIN PUBLIC KEY-----\n${body}\n-----END PUBLIC KEY-----`,
    privateKey: `-----BEGIN PRIVATE KEY-----\n${body}\n-----END PRIVATE KEY-----`,
  };

  // // Derive an encryption key from the passphrase
  // let passphraseBuffer = new TextEncoder().encode(passphrase);
  // let derivedKey = await window.crypto.subtle.importKey(
  //   'raw',
  //   passphraseBuffer,
  //   'PBKDF2',
  //   false,
  //   ['deriveKey']
  // );

  // // Encrypt the private key with the derived key
  // let encryptedPrivateKey = await window.crypto.subtle.encrypt(
  //   {
  //     name: 'AES-GCM',
  //     iv: window.crypto.getRandomValues(new Uint8Array(12)),
  //   },
  //   derivedKey,
  //   privateKey
  // );

  // TODO: CS: Save public key with id to MongoDB

  // return {
  //   encryptedPrivateKey: base64UrlEncode(encryptedPrivateKey),
  // };
}

async function decryptRSA(id, stringEncryptedPrivateKey, passphrase) {
  let binEncrtyptedPrivateKey = base64UrlDecode(stringEncryptedPrivateKey);

  // ... decrypt private key
  // TODO: CS: muss man ueberhaupt den public key holen?? eigl nein, da der ja implizit auf dem cipher text lieget
}


// Util:

// Binary to base 64 encoded string
function base64UrlEncode(arrayBuffer) {
  const base64 = window.btoa(String.fromCharCode.apply(null, new Uint8Array(arrayBuffer)));
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// Base 64 encoded string to binary
function base64UrlDecode(base64UrlString) {
  const base64 = base64UrlString.replace(/-/g, '+').replace(/_/g, '/');
  const paddingLength = 4 - (base64.length % 4);
  const paddedBase64 = base64 + '==='.slice(0, paddingLength);
  const binaryString = window.atob(paddedBase64);
  const arrayBuffer = new Uint8Array(binaryString.length);

  for (let i = 0; i < binaryString.length; i++) {
    arrayBuffer[i] = binaryString.charCodeAt(i);
  }

  return arrayBuffer;
}

export { encryptAES, decryptAES, generateRSAKeyPair, decryptRSA };
