<template>
    <div v-if="!saved"> 
        <!-- Can be beautified with CSS -->
        <!-- https://simedia.tech/blog/show-hide-password-input-values-with-vue-js/ -->
        <input v-model="owner_mail" placeholder="Bitte Email eingeben" />
        <br>
        <input v-model="passphrase" placeholder="Bitte Kennwort eingeben" :type="passwordFieldType" />
        <button @click="switchVisibility()" type="password">show / hide</button>
        <br>
        <button @click="login()">Log in.</button>
    </div>
    <div v-else class="saved">
        <div class="boxStyling mb-5">
            <h3 class="text-center mb-3">Logged in!</h3>
        </div>
    </div>
</template>

<script>
    export default {
        components: {
        },
        data() {
            return {
                owner_mail: "", 
                passphrase: "",
                passwordFieldType: "password",
                saved: false
            }
        },
        methods: {
            switchVisibility() {
                this.passwordFieldType = this.passwordFieldType === "password" ? "text" : "password";
            },
            login() { 
                // TODO:CS: JWT coming soon...
                window.localStorage.setItem(
                    "user_details", 
                    JSON.stringify({
                        user_mail: this.owner_mail,
                        user_password: this.passphrase
                    })
                )

                window.scrollTo(0, 0);
                this.saved = true;
            },
        }
    }
</script>

<style scoped>
    #upload-error {
    color: red;
    margin-top: 5px;
    }
</style>
