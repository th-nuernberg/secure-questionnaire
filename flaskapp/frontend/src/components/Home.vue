<template>
  <div class=".container">
    <h3 class="mt-5">QR-Code scannen:</h3> 
    <div>
      <code-scanner></code-scanner>
      <form onsubmit="return validateUser()" method="POST">
        <label for="pw">Passwort: </label>
        <input type="password" id="pw" name="password" required>
        <input type="checkbox" @click="togglePassword()">Passwort anzeigen
        <input type="submit" value="Anmelden">
    </form>
    </div>
  </div>
</template>

<script>
import CodeScanner from "./util/CodeScanner.vue";

export default {
  name: "LoginView",
  components: { CodeScanner },
  //created() {
    //this.$store.commit("resetAnswers");
  //},

  methods: { 
    validateUser() {
      const passwordInput = document.getElementById("pw");
      const password = passwordInput.value;

      //
      //const button = document.createElement("button");
      //button.innerText = pw;
      //document.getElementById("test").appendChild(button);
    }, 
    togglePassword(){
      var password = document.getElementById("pw");
      if (password.type === "password") {
        password.type = "text";
      } else {
        password.type = "password";
      }
    
    }
    
  }
}
</script>

<style scoped>

.container {
  max-width: 800px;
}
</style>
