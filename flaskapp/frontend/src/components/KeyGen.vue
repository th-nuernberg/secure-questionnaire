<template>
    <!-- Can be beautified with CSS -->
    <!-- https://simedia.tech/blog/show-hide-password-input-values-with-vue-js/ -->
    <input v-model="email" placeholder="Bitte Email eingeben" />
    <input v-model="passphrase" placeholder="Bitte Kennwort eingeben" :type="passwordFieldType" />
    <button @click="switchVisibility()" type="password">show / hide</button>
    <button @click="getRSAKeyPair()">Schlüssel Paar generieren.</button>
</template>

<script>
    import { generateRSAKeyPair } from "../encryption.js"
    
    export default {
        data() {
            return {
                counter: 0,
                abc: "",
                passphrase: "",
                email: "", 
                privateKey: "",
                passwordFieldType: "password",
            }
        },
        // browserify
        // mounted() {
        //     let cryptoStuff = document.createElement('script')
        //     cryptoStuff.setAttribute('src', '../bundle.js')
        //     document.head.appendChild(cryptoStuff)
        // },
        methods: {
            switchVisibility() {
                this.passwordFieldType = this.passwordFieldType === "password" ? "text" : "password";
            },
            getRSAKeyPair() {
                generateRSAKeyPair(this.passphrase).then((keyPair) => {
                    this.privateKey = keyPair.privateKey,  // weiterverarbeiten zu download...
                    this.$store
                        .dispatch("uploadPublicKey", { email: this.email, publicKey: keyPair.publicKey})
                    }
                )
                .catch(() => {})
            }
        }
    }
</script>
