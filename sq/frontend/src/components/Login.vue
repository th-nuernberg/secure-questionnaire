<template>
    <div class="container">
        <legend id="v-step-0">Login</legend>
        <span id="v-step-11"></span>
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
                    <input class="form-control" id="mail" v-model="owner_mail" placeholder="Bitte Email eingeben" />
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
            <div class="custom-file mt-3">
                <input type="file" class="custom-file-input mt-3" id="selectFile">
            </div>
            <div class="error mt-4" id="upload-error" style="display: none">
                <BootstrapIcon icon="exclamation-circle-fill" size="2x" />
                <p class="m-1 d-inline">
                Bitte Schlüssel Datei hochladen!
                </p>
            </div>
            <div class="d-grip col-4">
                <button type="button" class="btn btn-outline-dark btn-lg mt-2" @click="login()">
                    Login
                </button>
            </div>
            
            <!-- TODO: Fehler differenzieren... Password falsch ODER kein Nutzer bei angegebener Mail -->
            <div id="login-error" class="error mt-4" style="display: none">
                <BootstrapIcon icon="exclamation-circle-fill" size="2x" />
                <p class="m-1 d-inline">
                   Unbekannte Email oder falsches Passwort!
                </p>
            </div>
        </form>
    </div>
</template>

<script>
import { checkFields } from "../utils.js"

export default {
    components: {
    },
    data() {
        return {
            passphrase: "",
            owner_mail: "",
            passwordFieldType: "password",
            clicked: false,
            publicKey: undefined,
            publicExponent: undefined
        }
    },
    methods: {
        switchVisibility() {
            this.passwordFieldType = this.passwordFieldType === "password" ? "text" : "password";
            this.clicked = !this.clicked;
        },
        async login() {
            // TODO: Users should be able to change passwords at will

            let admin = this.owner_mail == "admin"

            if (checkFields(admin, false, this.owner_mail, this.passphrase)) {
                return
            }

            this.upload()

            // Wait for file reader
            if (!admin && this.publicKey == undefined && this.publicExponent == undefined) {
                await new Promise(r => setTimeout(r, 1000))
            }
            
            let toDispatch = admin ? "login_admin" : "login"
            // Move to questionnaire creation on successful login if regular user; for admin register page
            let path = admin ? "/admin/register" : "/admin"

            this.$store.dispatch("verifyPassword", { 
                owner_mail: this.owner_mail, 
                password: this.passphrase, 
            })
            .then((res) => {  
                this.$store.dispatch(toDispatch, { 
                    owner_mail: this.owner_mail, 
                    password: res,  // replace plain password with server hash (used for wrapping key)
                    publicKey: this.publicKey,
                    publicExponent: this.publicExponent
                })
                .then(() => {
                    this.$router.push({ path: path })
                })
                .catch(() => {
                    document.getElementById("login-error").style.display = "block";
                })
            })
            .catch(() => {
                document.getElementById("login-error").style.display = "block";
            })
        },
        upload() {
            var files = document.getElementById('selectFile').files;

            // TODO: Verify content fits schema; repeat user query if not
            if (files.length <= 0) {
                return false;
            }

            var fr = new FileReader();

            fr.onload = (e) => {
                this.$store.commit(
                    "setPrivateKeyParams",
                    JSON.parse(e.target.result)["privateKeyParams"]
                )
                this.publicKey = JSON.parse(e.target.result)["publicKey"]
                this.publicExponent = JSON.parse(e.target.result)["publicExponent"]
            }

            fr.readAsText(files.item(0));
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
}
</style>
