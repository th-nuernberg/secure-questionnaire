<template>
    <div v-if="!saved"> 
        <!-- Can be beautified with CSS -->
        <!-- https://simedia.tech/blog/show-hide-password-input-values-with-vue-js/ -->
        <input v-model="email" placeholder="Bitte Email eingeben" />
        <br>
        <input v-model="passphrase" placeholder="Bitte Kennwort eingeben" :type="passwordFieldType" />
        <button @click="switchVisibility()" type="password">show / hide</button>
        <br>
        <button @click="createRSAKeyPair(this.passphrase)">Schlüssel Paar generieren.</button>
        <qr-code :content="keyParams" class="qr" v-show="keyParams"></qr-code>
        <div id="upload-error" style="display: none">
          <BootstrapIcon icon="exclamation-circle-fill" size="2x" />
          <p class="m-1 d-inline">
            Fehler beim Upload. Bitte versuchen Sie es erneut.
          </p>
        </div>
    </div>
    <div v-else class="saved">
        <div class="boxStyling mb-5">
            <h3 class="text-center mb-3">Schuesselpaar erfolgreich erstellt!</h3>
            <button
                type="button"
                class="btn btn-outline-primary"
                @click="downloadPdf()"
                variant="primary"
                >
                <BootstrapIcon icon="download" size="2x" />
                Authentifizerungs-Schluessel runterladen
            </button>
        </div>
    </div>
    <!-- For testing purposes... -->

    <input id="myInput" placeholder="abcemailtest">
    <button @click="onMyClick">test key retreival</button>
    
    <!-- For testing purposes... -->
    <qrcode-stream @decode="onDecode" style="width: 300px;">
    </qrcode-stream>
</template>

<script>
    import { createRSAKeyPair } from "../encryption.js"
    import html2pdf from "html2pdf.js";
    import QrCode from "./QrCode.vue"
    
    
    // For testing purposes...
    import { QrcodeSream } from "vue3-qrcode-reader"
    
    export default {
        components: {
            QrcodeSream,
            QrCode,
            html2pdf
        },
        data() {
            return {
                passphrase: "",
                email: "", 
                privateKey: "",
                passwordFieldType: "password",
                keyParams: null,
                saved: false
            }
        },
        methods: {
            switchVisibility() {
                this.passwordFieldType = this.passwordFieldType === "password" ? "text" : "password";
            },
            async createRSAKeyPair(passphrase) { 
                // returns a public key, wrapped private key and salt+iv it has been wrapped with
                let keyPairPlusParams = await createRSAKeyPair(passphrase)

                this.keyParams = JSON.stringify({ 
                    salt: keyPairPlusParams.salt,
                    iv: keyPairPlusParams.iv,
                    wrappedPrivateKey: keyPairPlusParams.wrappedPrivateKey,
                })
                
                // TODO: CS: key creation must only be legal if email field set!
                this.$store
                    .dispatch("uploadPublicKey", { email: this.email, publicKey:keyPairPlusParams.publicKey })
                    .then(() => {
                        window.scrollTo(0, 0);
                        this.saved = true;
                    })
                    .catch(() => {
                        document.getElementById("upload-error").style.display = "block";
                    });
            },
            
            async downloadPdf() {
                var element = document.getElementsByClassName('qr')[0];
                html2pdf(element);  // direkt im element onclick=html2pdf(this) ??
                return

                // TODO: CS: This is how the questionnaires get downloaded
                // perhaps prettier because formatted? But can't make it work...
                // what does $refs do?!
                html2pdf(this.$refs.document, {
                    margin: 1,
                    filename: "document.pdf",
                    image: { type: "jpeg", quality: 0.98 },
                    html2canvas: { dpi: 500, letterRendering: true },
                    jsPDF: {
                    unit: "mm",
                    format: "a4",
                    orientation: "portrait",
                    putOnlyUsedFonts: "true",
                    },
                });
            },
            // For testing purposes...
            onDecode(decodedString) {
                console.log(JSON.parse(this.keyParams))
                console.log(decodedString)
                console.log(this.keyParams == decodedString)
                console.log(JSON.parse(decodedString))
            },

            onMyClick() {
                this.$store
                    .dispatch("keys", document.getElementById("myInput"))
                    .then((res) => {
                        document.getElementById("myInput").content = res
                    })
                    .catch(() => {});
            }
        }
    }
</script>
<style scoped>

.qr {
    display: inline-block;
    width: 100;
    height: 100;
    margin-right: auto;
    margin-left: auto;
    margin-top: 30px;
    margin-bottom: 30px;
  }

#upload-error {
  color: red;
  margin-top: 5px;
}
</style>

