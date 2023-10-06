<template>
    <div v-if="!saved"> 
        <!-- Can be beautified with CSS -->
        <!-- https://simedia.tech/blog/show-hide-password-input-values-with-vue-js/ -->
        <input v-model="owner_mail" placeholder="Bitte Email eingeben" />
        <br>
        <input v-model="owner_name" placeholder="Bitte Namen eingeben" />
        <br>
        <input v-model="passphrase" placeholder="Bitte Kennwort eingeben" :type="passwordFieldType" />
        <button @click="switchVisibility()" type="password">show / hide</button>
        <br>
        <button @click="createRSAKeyPair(this.passphrase)">Schlüssel Paar generieren.</button>
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
        </div>
    </div>
</template>

<script>
    import { createRSAKeyPair } from "../encryption.js"
    
    export default {
        components: {
        },
        data() {
            return {
                passphrase: "",
                owner_mail: "", 
                owner_name: "", 
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
            saveKeyParamsAsFile(filename, dataObjToWrite) {
                const blob = new Blob([JSON.stringify(dataObjToWrite)], { type: "text/json" });
                const link = document.createElement("a");

                link.download = filename;
                link.href = window.URL.createObjectURL(blob);
                link.dataset.downloadurl = ["text/json", link.download, link.href].join(":");

                const evt = new MouseEvent("click", {
                    view: window,
                    bubbles: true,
                    cancelable: true,
                });

                link.dispatchEvent(evt);
                link.remove()
            },
            async createRSAKeyPair(passphrase) { 
                // returns a public key, wrapped private key and salt+iv it has been wrapped with
                let keyPairPlusParams = await createRSAKeyPair(passphrase)

                this.keyParams = { 
                    wrappedPrivateKey: Buffer.from(keyPairPlusParams.wrappedPrivateKey).toString("base64"),
                    salt: Buffer.from(keyPairPlusParams.salt).toString("base64"),
                    wrappingIv: Buffer.from(keyPairPlusParams.wrappingIv).toString("base64"),
                }

                this.saveKeyParamsAsFile("Schluessel.json", this.keyParams)

                // TODO: CS: key creation must only be legal if email field set!
                this.$store
                    .dispatch("uploadPublicKey", { 
                        owner_mail: this.owner_mail, 
                        owner_name: this.owner_name, 
                        publicKey: Buffer.from(keyPairPlusParams.publicKey).toString("base64")
                    })
                    .then(() => {
                        window.scrollTo(0, 0);
                        this.saved = true;
                    })
                    .catch(() => {
                        document.getElementById("upload-error").style.display = "block";
                    });
            },
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
