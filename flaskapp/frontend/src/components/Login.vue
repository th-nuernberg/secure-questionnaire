<template>
    <div v-if="!saved"> 
        <!-- Can be beautified with CSS -->
        <!-- https://simedia.tech/blog/show-hide-password-input-values-with-vue-js/ -->
        <input id="mail" v-model="owner_mail" placeholder="Bitte Email eingeben" />
        <br>
        <input id="name" v-model="owner_name" placeholder="Bei erstem Registrieren angeben" />
        <br>
        <input id="passphrase" v-model="passphrase" placeholder="Bitte Kennwort eingeben" :type="passwordFieldType" />
        <button @click="switchVisibility()" type="password">show / hide</button>
        <br>
        <button @click="login()">Log in</button>
        <button @click="register()">Register</button>

        <div id="upload-error" style="display: none">
          <BootstrapIcon icon="exclamation-circle-fill" size="2x" />
          <p class="m-1 d-inline">
            Kein Nutzer unter angegebener Email. Bitte Registrieren Sie sich!
          </p>
        </div>
    </div>
    <div v-else class="saved">
        <div class="boxStyling mb-5">
            <h3 class="text-center mb-3">Logged in!</h3>
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
                keyParams: null,
                saved: false,
                passwordFieldType: "password",
            }
        },
        methods: {
            switchVisibility() {
                this.passwordFieldType = this.passwordFieldType === "password" ? "text" : "password";
            },
            login() { 
                // window.localStorage.setItem(
                //     "user_details", 
                //     JSON.stringify({
                //         user_mail: this.owner_mail,
                //         user_name: this.owner_name,
                //         user_password: this.passphrase
                //     })
                // )

                // TODO: CS: Allow login only when registered !

                if (this.checkFields(false)) {
                    return
                }

                this.$store.dispatch('login', { owner_mail: this.owner_mail, password: this.passphrase, owner_name: this.owner_name })
                    .then(() => {
                        window.scrollTo(0, 0);
                        this.saved = true;
                    })
                    .catch(() => {
                        document.getElementById("upload-error").style.display = "block";
                    })
            },
            register() {
                // All necessary fields must be set
                if (this.checkFields(true) && owner_name == "") {
                    return
                }
                
                this.$store.dispatch('register', { owner_mail: this.owner_mail, password: this.passphrase, owner_name: this.owner_name })
                this.createRSAKeyPair()
            },
            async createRSAKeyPair(passphrase) { 
                // returns a public key, wrapped private key and salt+iv it has been wrapped with
                let keyPairPlusParams = await createRSAKeyPair(passphrase)

                this.keyParams = { 
                    wrappedPrivateKey: Buffer.from(keyPairPlusParams.wrappedPrivateKey).toString("base64"),
                    salt: Buffer.from(keyPairPlusParams.salt).toString("base64"),
                    wrappingIv: Buffer.from(keyPairPlusParams.wrappingIv).toString("base64"),
                }

                window.localStorage.setItem(
                    this.owner_mail, 
                    JSON.stringify(this.keyParams)
                )

                // TODO: CS: key creation must only be legal if email field set!
                this.$store
                    .dispatch("uploadPublicKey", { 
                        owner_mail: this.owner_mail, 
                        owner_name: this.owner_name, 
                        publicKey: Buffer.from(keyPairPlusParams.publicKey).toString("base64")
                    })
            },
            checkFields(register) {
                let empty = false

                if (register && this.owner_name == "") {
                    document.getElementById("name").className = "empty"
                    empty = true
                }
                if (this.owner_mail == "") {
                    document.getElementById("mail").className = "empty"
                    empty = true
                }
                if (this.passphrase == "") {
                    document.getElementById("passphrase").className = "empty"
                    empty = true
                }

                return empty
            }
        }
    }
</script>

<style scoped>
    #upload-error {
    color: red;
    margin-top: 5px;
    }
    .empty {
        border: 1px solid red;
    }
</style>
