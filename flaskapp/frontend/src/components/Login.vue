<template>
    <!-- Can be beautified with CSS -->
    <!-- https://simedia.tech/blog/show-hide-password-input-values-with-vue-js/ -->
    <!-- <input id="mail" v-model="owner_mail" placeholder="Bitte Email eingeben" />
    <br>
    <input id="name" v-model="owner_name" placeholder="Bei erstem Registrieren angeben" />
    <br>
    <input id="passphrase" v-model="passphrase" placeholder="Bitte Kennwort eingeben" :type="passwordFieldType" />
    <button @click="switchVisibility()" type="password">show / hide</button>
    <br>
    <button @click="login()">Log in</button>

    <div id="login-error" class="error" style="display: none">
        <BootstrapIcon icon="exclamation-circle-fill" size="2x" />
        <p class="m-1 d-inline">
        Kein Nutzer unter angegebener Email. Ihr Admin muss Sie erst registrieren!
        </p>
    </div> -->

    <div class="container">
        <legend>Login</legend>
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
                <label class="control-label" for="name">
                    Name
                </label>
                <div class="input-group">
                    <span class="input-group-text">
                        <BootstrapIcon icon="person" size="1x" />
                    </span>
                    <input class="form-control" id="name" v-model="owner_name"
                        placeholder="Bei erstem Registrieren angeben" />
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
                            <BootstrapIcon icon="eye" size="1x" />
                        </button>
                    </div>     
                </div>
            </div>
            <div class="d-grip col-4">
                <button type="button" class="btn btn-outline-dark btn-lg mt-2" @click="login()">
                    Login
                </button>
            </div>          

            <div id="login-error" class="error mt-4" style="display: none">
                <BootstrapIcon icon="exclamation-circle-fill" size="2x" />
                <p class="m-1 d-inline">
                    Kein Nutzer unter angegebener Email. Ihr Admin muss Sie erst registrieren!
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
            owner_name: "",
            passwordFieldType: "password",
        }
    },
    methods: {
        switchVisibility() {
            this.passwordFieldType = this.passwordFieldType === "password" ? "text" : "password";
        },
        login() {
            if (checkFields(false, this.owner_mail, this.owner_name, this.passphrase)) {
                return
            }

            this.$store.dispatch('login', { owner_mail: this.owner_mail, password: this.passphrase, owner_name: this.owner_name })
                .then(() => {
                    // Move to questionnaire creation on successful login

                    if (this.owner_mail != "admin") {
                        this.$router.push({ path: `/doctorView/create` });
                    } else {
                        this.$router.push({ path: `/register` })
                    }
                })
                .catch(() => {
                    document.getElementById("login-error").style.display = "block";
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

#passBtn{
    border-color: #dee2e6
}
</style>
