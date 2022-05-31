<template>
  <body>
    <div class="placeholder"></div>
    <div class="txt-center">
        <qrcode-vue v-if=showQR :value="this.valueQR" :size="this.sizeQR" level="H" />
    </div>
    <div class="placeholder"></div>

    <button v-on:click="EncryptMessage('henlo')">

        Encrypt It
    </button>
    <p>{{secret}}</p>
  </body>
</template>


<script >
import "bootstrap/dist/css/bootstrap.css";
import QrcodeVue from 'qrcode.vue'
import encryption from "../../assets/De-Encryption/script.js"

export default {
  name: "app",
  components:{
    QrcodeVue,
  },
  data() {
    return{
        valueQR: "",
        showQR: false,
        sizeQR: 400,
        data: Object,
        secret: String,
        rsa_pub_key: String
    };
  },
  methods: {
    generateQRCode(value,id){
          this.showQR = true;
          this.valueQR = JSON.stringify(value.toLocaleString())+";"+id
      },
    async EncryptMessage(message){
      let id = crypto.randomUUID();

      let values = await encryption['AES']['encrypt'](message)

      this.generateQRCode(values['Key'], id)

      let body =  {    'Message': values['Cipher'],
                    'IV': values['IV'],
                    'ID':id,
                    'test': values['Key']
                }

      values = await encryption['AES']['encrypt'](body['Message'])

      body['Message'] = values['Cipher']
      body['IV2'] = values['IV']

      body['Key'] = await encryption['RSA']['encrypt'](this.rsa_pub_key, values['Key'])

      //console.log(body);
      
      let url = "http://localhost/POST/"+id

      console.log(url)

      let response = await fetch(url, {
            'method':"POST",
              "headers": {
            "Content-Type": "application/json"
        },
        "body": JSON.stringify(body)
        })

      this.handleResponse(response)
      

    },

    handleResponse(response){
      //console.log(response.status)
      if(response.status == 200){
        console.log("Erfolgreich abgeschickt")
      }
    }
  },
  created() {
      this.rsa_pub_key = 
  `-----BEGIN PUBLIC KEY-----
  MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAxMDhX3bxEgrA+9qb67KH
  BjQTK6xhx3NkaaCWQSdHheNKIejcZi1YQUssEGKelPKWr5/5sX2oy9W7CUx1ir3t
  jmSwkn5R5nxCbwbvkv+XGQuRYn+xlsiktjnQJEHV2gZcui+HX82++55bV2ac/Qap
  4mhz/TO+aQ2g5dwXeDrt+oC+qUIjlSTYDAvgDYRKlksJCKElpZLfLzEaVbhljSlo
  JCXj5EtJq/aHJUzKfJl13X+ykzq01dQmLzqjZ5Fn0RKnym0piJFzENK4KfqEkudd
  e601IpcoU2zUJmZYeCel/pBpn+/TMTnxd7wt64e8kmbCjTMSTAHBcBj8U/w0Q73H
  XwIDAQAB
  -----END PUBLIC KEY-----`;
  },
  mounted() {
      
  }
}
</script>