<template>
    <div v-if="!saved"> 
        <!-- Can be beautified with CSS -->
        <!-- https://simedia.tech/blog/show-hide-password-input-values-with-vue-js/ -->
        <input v-model="owner" placeholder="Bitte Email eingeben" />
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
    <!-- For testing purposes... -->

    <input id="myInput" placeholder="abcemailtest">
    <textarea id="myText1"></textarea>
    <textarea id="myText2"></textarea>
    <button @click="onMyClick">test key retreival</button>
    
</template>

<script>
    import { createRSAKeyPair, encryptAES } from "../encryption.js"
    
    export default {
        components: {
        },
        data() {
            return {
                passphrase: "",
                owner: "", 
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

                this.keyParams = { 
                    salt: keyPairPlusParams.salt,
                    iv: keyPairPlusParams.iv,
                    wrappedPrivateKey: Buffer.from(keyPairPlusParams.wrappedPrivateKey).toString("base64"),
                }

                window.localStorage.setItem(this.owner, 
                    JSON.stringify(this.keyParams)
                )

                // TODO: CS: key creation must only be legal if email field set!
                this.$store
                    .dispatch("uploadPublicKey", { 
                        owner: this.owner, 
                        publicKey: keyPairPlusParams.publicKey
                    })
                    .then(() => {
                        window.scrollTo(0, 0);
                        this.saved = true;
                    })
                    .catch(() => {
                        document.getElementById("upload-error").style.display = "block";
                    });
            },
            
            onMyClick() {
                this.$store
                    .dispatch("getPublicKey", document.getElementById("myInput").value)
                    .then((res) => {
                        document.getElementById("myText1").placeholder = res.data
                        document.getElementById("myText2").placeholder = window.localStorage.getItem(this.owner)
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
