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

    <div id="login-error" class="error" style="display: none">
        <BootstrapIcon icon="exclamation-circle-fill" size="2x" />
        <p class="m-1 d-inline">
        Kein Nutzer unter angegebener Email. Ihr Admin muss Sie erst registrieren!
        </p>
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
</style>
