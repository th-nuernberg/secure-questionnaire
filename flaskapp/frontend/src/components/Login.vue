<template>
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

    <div id="login-error" class="error" style="display: none">
        <BootstrapIcon icon="exclamation-circle-fill" size="2x" />
        <p class="m-1 d-inline">
        Kein Nutzer unter angegebener Email. Bitte Registrieren Sie sich!
        </p>
    </div>
    <div id="register-error" class="error" style="display: none">
        <BootstrapIcon icon="exclamation-circle-fill" size="2x" />
        <p class="m-1 d-inline">
        Nutzer unter angegebener Email existiert schon. Bitte verwenden Sie den login oder eine andere Email!
        </p>
    </div>
    <div id="register-success" class="success" style="display: none">
        <p class="m-1 d-inline">
        Nutzer erfolgreich registriert!
        </p>
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
                passwordFieldType: "password",
            }
        },
        methods: {
            switchVisibility() {
                this.passwordFieldType = this.passwordFieldType === "password" ? "text" : "password";
            },
            login() { 
                if (this.checkFields(false)) {
                    return
                }

                this.$store.dispatch('login', { owner_mail: this.owner_mail, password: this.passphrase, owner_name: this.owner_name })
                    .then(() => {
                        // Move to questionnaire creation on successful login
                        this.$router.push({ path: `/doctorView/create` });
                    })
                    .catch(() => {
                        document.getElementById("login-error").style.display = "block";
                    })
            },
            register() {
                // All necessary fields must be set
                if (this.checkFields(true) && owner_name == "") {
                    return
                }
                
                this.$store.dispatch('register', { owner_mail: this.owner_mail, password: this.passphrase, owner_name: this.owner_name })
                    .then(() => {
                        document.getElementById("register-success").style.display = "block";
                    })
                    .catch(() => {
                        document.getElementById("register-error").style.display = "block";
                    })

                this.createRSAKeyPair(this.passphrase)
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

                // window.localStorage.setItem(
                //     "user_details", 
                //     JSON.stringify({
                //         user_mail: this.owner_mail,
                //         user_password: this.passphrase
                //     })
                // )

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
    .error {
        color: red;
        margin-top: 5px;
    }
    .success {
        color: green;
        margin-top: 5px;
    }
    .empty {
        border: 1px solid red;
    }
</style>
