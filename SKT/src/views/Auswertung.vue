<template>
  <body class="body">

    <h4>Kurztest zur Erfassung von Gedächtnis- und Aufmerksamkeitsstörungen</h4><br>

    <DisplayResults :task_data="task_data"/><br> 

    <div class="Datenübermittlung" v-if="!this.transfer">
      <br><h5 class="txt-center">Datenübermittlung</h5>
      <p>Durch einen Klick auf den Button „Transfer starten“ wird ihr Testergebnis übermittelt. Sie erhalten im Anschluss einen QR-Code.</p>
      <button class="button"  v-on:click="EncryptMessage(task_data)">Transfer starten</button>     
    </div>

    <div v-if="this.transfer">
    <br><h5 class="txt-center">Bitte bewahren Sie den ausgedruckten QR-Code an einem sicheren Ort auf!</h5>
      Wenn Sie den ausgedruckten QR Code entsorgen, achten Sie bitte auf eine sichere Zerstörung, damit niemand anderes diesen verwenden kann.<br><br>
      <button class="button" v-on:click="DownloadCode(this.valueQR)">Download QR-Code</button>   
      <qrcode-vue class=qrcode v-if=showQR :value="this.valueQR" :size="this.sizeQR" level="H" />
    </div>
    <button @click="test">Test</button>
  </body>
</template>


<script >
import QrcodeVue from 'qrcode.vue';
import encryption from "../plugins/deEncryption.js";
import DisplayResults from "../components/DisplayResults.vue"

export default {
  name: "app",
  components:{
    QrcodeVue,
    DisplayResults,
  },
  data() {
    return{
        valueQR: "",
        showQR: false,
        sizeQR: 400,
        data: Object,
        secret: String,
        rsa_pub_key: String,
        task_data: [],
        transfer: Boolean,
        audio: null,
    };
  },
  methods: {
    test(){
      console.log("play")
      this.audio.play()
    },
    getData() {
      return this.$store.getters.getData;
    },
    generateQRCode(value,id){
          this.showQR = true;
          this.valueQR = value.toLocaleString()+";"+id; 
    },
    DownloadCode(data){
       console.log(data);
      
    },
    async EncryptMessage(message){
      this.transfer = true;
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
      if(response.status == 200){
        console.log("Erfolgreich abgeschickt")
      }
    },

  },
  created() {
    this.transfer = false;
    
    this.task_data = this.getData()
    console.log(this.task_data)
    //let audioUrl = URL.createObjectURL(this.task_data['1']['audio']);
    this.audio = new Audio(this.task_data['1']['audio']);
    this.audio.play()
    //this.audio = new Audio(this.task_data['1']['audio']);
    //  this.audio.play()
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
}
</script>