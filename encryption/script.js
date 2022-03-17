let pub_key = 
  `-----BEGIN PUBLIC KEY-----
  MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAxMDhX3bxEgrA+9qb67KH
  BjQTK6xhx3NkaaCWQSdHheNKIejcZi1YQUssEGKelPKWr5/5sX2oy9W7CUx1ir3t
  jmSwkn5R5nxCbwbvkv+XGQuRYn+xlsiktjnQJEHV2gZcui+HX82++55bV2ac/Qap
  4mhz/TO+aQ2g5dwXeDrt+oC+qUIjlSTYDAvgDYRKlksJCKElpZLfLzEaVbhljSlo
  JCXj5EtJq/aHJUzKfJl13X+ykzq01dQmLzqjZ5Fn0RKnym0piJFzENK4KfqEkudd
  e601IpcoU2zUJmZYeCel/pBpn+/TMTnxd7wt64e8kmbCjTMSTAHBcBj8U/w0Q73H
  XwIDAQAB
  -----END PUBLIC KEY-----`;


//String Input Json Object
function stringToJson(string)
{
  return newJson =
  {
    "title":"example json",
    "input": 
    {
      "Cipher": string
    }
  }
}

//Secure random number generator
function randomID()
{
  return crypto.randomUUID();
}

//STores the Key and ID into a QR Code
async function GenerateQRCode(key, id) 
{
  //var qrcode = new QRCode(document.getElementById('qrcode'));    
  qrcode.makeCode(key+";"+id);

  //Show Hidden div
  //var x = document.getElementById('QRCodeButtons');
  //if (x.style.display == 'none'){x.style.display = 'block' };
}



// String to ArrayBuffer Method


  function fetchPost(url, body){
    fetch(url, { 
      "method": "POST",
      "headers": {
          "Content-Type": "application/json"
      },
      "body": body
      })
      .then(response => {
      console.log(response);
      })
      .catch(err => {
      console.error(err);
      });
  }  
  



// RSA Encryption and Decryption


  function importpublicRsaKey(pem) {

    const pemHeader = "-----BEGIN PUBLIC KEY-----";
    const pemFooter = "-----END PUBLIC KEY-----";
    const pemContents = pem.substring(pemHeader.length, pem.length - pemFooter.length);

    const binaryDerString = window.atob(pemContents);

    const binaryDer = str2ab(binaryDerString);

    return window.crypto.subtle.importKey(
      "spki",
      binaryDer,
      {
        name: "RSA-OAEP",
        hash: "SHA-256"
      },
      true,
      ["encrypt"]
    );
  }


  function str2ab(str) {
    const buf = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return buf;
  }


  function importprivateRSAKey(pem) {
    // fetch the part of the PEM string between header and footer
    const pemHeader = "-----BEGIN RSA PRIVATE KEY-----";
    const pemFooter = "-----END RSA PRIVATE KEY-----";
    const pemContents = pem.substring(pemHeader.length, pem.length - pemFooter.length);
    // base64 decode the string to get the binary data
    const binaryDerString = window.atob(pemContents);
    // convert from a binary string to an ArrayBuffer
    const binaryDer = str2ab(binaryDerString);

    return window.crypto.subtle.importKey(
      "pkcs8",
      binaryDer,
      {
        name: "RSA-OAEP",
        hash: "SHA-256"
      },
      true,
      ["decrypt"]
    );
  }



async function encryptRSA(key, message) {
  
    let encoded = getMessageEncoding(message);
    return importpublicRsaKey(key).then(  keyobj => {
    return window.crypto.subtle.encrypt(
      {
        name: "RSA-OAEP"
      },
      keyobj,
      encoded
    )}).then( enc =>  new Uint8Array(enc))
  }


 

async function decryptRSA(key, ciphertext) {
    return importprivateRSAKey(key).then( keyobj => {
    return window.crypto.subtle.decrypt(
      {
        name: "RSA-OAEP"
      },
      keyobj,
      ciphertext
    )}).then( encodedMSG => {
      return new TextDecoder().decode(encodedMSG);
    })
  }

// AES Encryption and Decryption



   
    
  async function encryptAES(message) { 
    let iv = window.crypto.getRandomValues(new Uint8Array(12)); 
    let key = await generateAESKey();
    let encoded = getMessageEncoding(message); 
    
    
    ciphertext = await window.crypto.subtle.encrypt( 
      { 
        name: "AES-GCM", 
        iv: iv 
      }, 
      key, 
      encoded 
    ); 
      let rawkey = await crypto.subtle.exportKey('raw', key)

    return {'Key':new Uint8Array(rawkey), 'Cipher': new Uint8Array(ciphertext), 'IV': iv}
  
    }

    function generateAESKey() {
      return  window.crypto.subtle.generateKey( 
        { 
            name: "AES-GCM", 
            length: 256, 
        }, 
        true, 
        ["encrypt", "decrypt"] 
        )
      }

      function getMessageEncoding(message) {
        let enc = new TextEncoder();
        return enc.encode(message);
      }

  async function decryptAES(key, cipher, iv) {
      return importAESKey(key).then((keyobj) => {
       return window.crypto.subtle.decrypt(
        {
          name: "AES-GCM",
          iv: iv
        },
        keyobj,
        cipher
      )
    }).then((encodedMSG) => {
        let dec = new TextDecoder();
        return dec.decode(encodedMSG)
      })
  
    }



    function importAESKey(key) {
      return window.crypto.subtle.importKey(
        "raw",
        key,
        "AES-GCM",
        true,
        ["decrypt"]
      )
    }