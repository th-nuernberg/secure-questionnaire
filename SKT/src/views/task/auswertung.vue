<template>
  <body class="body">

  <h3>Auswertung Kurztest zur Erfassung von Gedächtnis- und Aufmerksamkeitsstörungen</h3>

  <div class="auswertung">
    <h5>Aufgabe 1 Gegenstände benennen: Ihre Bearbeitungszeit: {{60-task_data["1"]["time"]}} Sekunden; Erkannte Gegenstände: {{task_data["1"]["images"].map(entry => entry['recognized']).reduce((x,y)=>x+y)}}/12 </h5>
    <h5>Aufgabe 2 Gegenstände unmittelbar reproduzieren: Ihre Bearbeitungszeit: {{60-task_data["2"]["time"]}} Sekunden; Erkannte Gegenstände: {{12-task_data["2"]["missing"].length}}/12</h5>
  </div>
      
    <div class="placeholder"></div>
    <div class="txt-center">
        <qrcode-vue class=qrcode v-if=showQR :value="this.valueQR" :size="this.sizeQR" level="H" />
    </div>
    <div class="placeholder"></div>

    <button v-on:click="EncryptMessage(task_data)">

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
        rsa_pub_key: String,
        task_data: []
    };
  },
  methods: {
    getData() {
      return this.$store.getters.getData;
    },
    generateQRCode(value,id){
          this.showQR = true;
          this.valueQR = JSON.stringify(value.toLocaleString())+";"+id
      },
    async EncryptMessage(message){
      message = JSON.stringify(message);
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
      this.task_data = this.getData()
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