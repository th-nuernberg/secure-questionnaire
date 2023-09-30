<template>
    <div v-if="!saved"> 
        <!-- Can be beautified with CSS -->
        <!-- https://simedia.tech/blog/show-hide-password-input-values-with-vue-js/ -->
        <input v-model="owner_mail" placeholder="Bitte Email eingeben" />
        <br>
        <input v-model="passphrase" placeholder="Bitte Kennwort eingeben" :type="passwordFieldType" />
        <button @click="switchVisibility()" type="password">show / hide</button>
        <br>
        <input type="file" id="selectFiles"/><br/>
        <button @click="login()">Log in.</button>
        <div id="upload-error" style="display: none">
          <BootstrapIcon icon="exclamation-circle-fill" size="2x" />
          <p class="m-1 d-inline">
             Bitte Schluessel Datei hochladen!
          </p>
        </div>
    </div>
    <div v-else class="saved">
        <div class="boxStyling mb-5">
            <h3 class="text-center mb-3">Logged in!</h3>
        </div>
    </div>
    <button @click="abc()">drueck mich</button>
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
                if(document.getElementById('selectFiles').files.item(0) == null) {
                    document.getElementById("upload-error").style.display = "block";
                    return
                }

                this.upload()
                
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
            upload() {
                var files = document.getElementById('selectFiles').files;

                if (files.length <= 0) {
                    return false;
                }

                var fr = new FileReader();

                fr.onload = (e) => { 
                    var result = JSON.parse(e.target.result);
                    
                    // Set field in store
                    this.$store.commit("setPrivateKeyParams", result)
                    window.scrollTo(0, 0);
                    this.saved = true;
                }

                fr.readAsText(files.item(0));
            },
            abc() {
                console.log(this.$store.state.privateKeyParams)
            }
        }
    }
</script>

<style scoped>
    #upload-error {
    color: red;
    margin-top: 5px;
    }
</style>
