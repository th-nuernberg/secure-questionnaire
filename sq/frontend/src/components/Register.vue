<template>
    <div class="container">
        <legend>Registrieren</legend>
        <hr class="my-3">

        <form class="mt-3">
            <div class="col-6 pb-3">
                <label class="control-label" for="mail">
                    Email
                </label>
                <div class="input-group">
                    <span class="input-group-text">
                        <BootstrapIcon icon="envelope-at" size="1x" />
                    </span>
                    <input class="form-control" id="mail" v-model="owner_mail"
                        placeholder="Bitte Email des anzulegenden Nutzer eingeben" />
                </div>
            </div>
            <div class="col-6 pb-3">
                <label class="control-label" for="name">
                    Name
                </label>
                <div class="input-group">
                    <span class="input-group-text">
                        <BootstrapIcon icon="person" size="1x" />
                    </span>
                    <input class="form-control" id="name" v-model="owner_name"
                        placeholder="Bitte Namen des anzulegenden Nutzer eingeben" />
                </div>
            </div>
            <div class="col-6 pb-3">
                <label class="control-label" for="passphrase">
                    Passwort
                </label>
                <div class="input-group">
                    <span class="input-group-text">
                        <BootstrapIcon icon="lock" size="1x" />
                    </span>
                    <input class="form-control" id="passphrase" v-model="passphrase" placeholder="Bitte Kennwort eingeben"
                        :type="passwordFieldType" />

                    <div class="input-group-append">
                        <button id="passBtn" class="btn btn-outline-dark" type="button" @click="switchVisibility()">
                            <BootstrapIcon v-if="this.clicked === true" icon="eye" size="1x" />
                            <BootstrapIcon v-else icon="eye-slash" size="1x" />
                        </button>
                    </div>
                </div>
            </div>
            <div class="d-grip col-4">
                <button type="button" class="btn btn-outline-dark btn-lg mt-2" @click="register()">
                    Registrieren
                </button>
            </div>

            <div id="register-error" class="error mt-4" style="display: none">
                <BootstrapIcon icon="exclamation-circle-fill" size="2x" />
                <p class="m-1 d-inline">
                    Nutzer unter angegebener Email existiert schon. Wurde am {{ createdOn }} registriert. <br>
                    Falls Sie die Daten ersetzen, wird der aktuelle Schlüssel beim Arzt ungültig und muss neu übetragen werden.
                </p>
                <button type="button" class="btn btn-outline-dark btn-lg mt-2" @click="replace()">
                    Ersetzen
                </button>
            </div>

            <div id="non-admin-error" class="error mt-4" style="display: none">
                <BootstrapIcon icon="exclamation-circle-fill" size="2x" />
                <p class="m-1 d-inline">
                    Um neue Nutzer registrieren zu können müssen Sie als Admin eingeloggt sein.
                </p>
            </div>
            <div id="register-success" class="success mt-4" style="display: none">
                <p class="m-1 d-inline">
                    Nutzer erfolgreich registriert!
                </p>
            </div>
            <div id="replace-success" class="success mt-4" style="display: none">
                <p class="m-1 d-inline">
                    Privater Schlüssel und Passwort wurde ersetzt!
                </p>
            </div>
        </form>
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
            clicked: false,
            createdOn: ""
        }
    },
    methods: {
        switchVisibility() {
            this.passwordFieldType = this.passwordFieldType === "password" ? "text" : "password";
            this.clicked = !this.clicked;

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
        replace() {
            this.register(true)
            document.getElementById("register-error").style.display = "none";
        },
        register(replace) {
            this.$store.dispatch('getUserDetails')
                .then((res) => {

                    if (res.owner_mail != "admin") {
                        document.getElementById("non-admin-error").style.display = "block";
                        return
                    }

                    // All necessary fields must be set
                    if (checkFields(true, true, this.owner_mail, this.owner_name, this.passphrase)) {
                        return
                    }

                    this.$store.dispatch('register', { 
                        owner_mail: this.owner_mail, 
                        password: this.passphrase, 
                        owner_name: this.owner_name, 
                        replace: replace ? true : false  // If undefined set false rather than "undefined"
                    })
                    .then((res) => {
                        if (res.data["exists"] && !replace){
                            this.createdOn = res.data["created_on"]
                            document.getElementById("register-error").style.display = "block";

                        } else {
                            document.getElementById("register-success").style.display = "block";
                            this.createRSAKeyPair(res.data["hashed_password"])
                        }
                    })
                    .catch()
                }).catch(() => {
                    document.getElementById("non-admin-error").style.display = "block";
                })
        },
        async createRSAKeyPair(passphrase) {
            // returns a public key, wrapped private key and salt+iv it has been wrapped with
            let keyPairPlusParams = await createRSAKeyPair(passphrase)

            this.saveKeyParamsAsFile("Schlüssel.json", {
                publicKey: Buffer.from(keyPairPlusParams.publicKey).toString("base64"),
                publicExponent: keyPairPlusParams.publicExponent.toString(),
                privateKeyParams: {
                    wrappedPrivateKey: Buffer.from(keyPairPlusParams.wrappedPrivateKey).toString("base64"),
                    salt: Buffer.from(keyPairPlusParams.salt).toString("base64"),
                    wrappingIv: Buffer.from(keyPairPlusParams.wrappingIv).toString("base64"),
                }
            })

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

#passBtn {
    border-color: #dee2e6
}</style>
