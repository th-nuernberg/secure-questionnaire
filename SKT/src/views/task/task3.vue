<template>
  <body>

    <div>
        <qrcode-vue value="vaasdasdasfcvawlue" size=400 level="H" />
    </div>
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
        data: Object,
        secret: String
    };
  },
  methods: {

  },
  created() {
      encryption['AES']['encrypt']("Henlo").then(x => this.secret = x['Cipher'])
  },
  mounted() {
      encryption['AES']['encrypt']("Henlo").then(x =>this.secret =  x['Cipher'])
  }
}

</script>

