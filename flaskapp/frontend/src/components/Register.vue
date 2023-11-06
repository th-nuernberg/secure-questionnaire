<template>
    <!-- Can be beautified with CSS -->
    <!-- https://simedia.tech/blog/show-hide-password-input-values-with-vue-js/ -->
    <input id="mail" v-model="owner_mail" placeholder="Bitte Email des anzulegenden Nutzer eingeben" />
    <br>
    <input id="name" v-model="owner_name" placeholder="Bitte Namen des anzulegenden Nutzer eingeben" />
    <br>
    <input id="passphrase" v-model="passphrase" placeholder="Bitte Kennwort eingeben" :type="passwordFieldType" />
    <button @click="switchVisibility()" type="password">show / hide</button>
    <br>
    <button @click="register()">Register</button>
    <div id="register-error" class="error" style="display: none">
        <BootstrapIcon icon="exclamation-circle-fill" size="2x" />
        <p class="m-1 d-inline">
            Nutzer unter angegebener Email existiert schon. Bitte verwenden Sie den login oder eine andere Email!
        </p>
    </div>
    <div id="non-admin-error" class="error" style="display: none">
        <BootstrapIcon icon="exclamation-circle-fill" size="2x" />
        <p class="m-1 d-inline">
            Um neue Nutzer registrieren zu können müssen Sie als Admin eingeloggt sein.
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
    import { checkFields } from "../utils.js"

    export default {
        components: {
        },
        data() {
            return {
                passphrase: "",
                owner_mail: "", 
                owner_name: "", 
                passwordFieldType: "password",
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
            register() {
                this.$store.dispatch('getUserDetails')
                .then((res) => {

                    if (res.owner_mail != "admin") {
                        document.getElementById("non-admin-error").style.display = "block";
                        return
                    }

                    // All necessary fields must be set
                    if (checkFields(true, this.owner_mail, this.owner_name, this.passphrase) && owner_name == "") {
                        return
                    }
                    
                    this.$store.dispatch('register', { owner_mail: this.owner_mail, password: this.passphrase, owner_name: this.owner_name })
                        .then((hashedPassword) => {
                            document.getElementById("register-success").style.display = "block";
                            this.createRSAKeyPair(hashedPassword.data)
                        })
                        .catch(() => {
                            document.getElementById("register-error").style.display = "block";
                        })
    
                }).catch(() => {
                    document.getElementById("non-admin-error").style.display = "block";

                }) 
            },
            async createRSAKeyPair(passphrase) { 
                // returns a public key, wrapped private key and salt+iv it has been wrapped with
                let keyPairPlusParams = await createRSAKeyPair(passphrase)

                let keyParams = { 
                    wrappedPrivateKey: Buffer.from(keyPairPlusParams.wrappedPrivateKey).toString("base64"),
                    salt: Buffer.from(keyPairPlusParams.salt).toString("base64"),
                    wrappingIv: Buffer.from(keyPairPlusParams.wrappingIv).toString("base64"),
                }

                this.saveKeyParamsAsFile("Schlüssel.json", keyParams)

                this.$store
                    .dispatch("uploadPublicKey", { 
                        owner_mail: this.owner_mail, 
                        owner_name: this.owner_name, 
                        publicKey: Buffer.from(keyPairPlusParams.publicKey).toString("base64")
                    })
            },
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
