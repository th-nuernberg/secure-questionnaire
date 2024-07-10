<template>
  <div class="container">
    <h3 class="mt-5">QR-Code scannen:</h3>
    <code-scanner></code-scanner>
    <button class="small-button mt-3" @click="manually()">
      Code manuell eingeben
    </button>

    <code-manually v-show="showManually" @manually="manually"></code-manually>
  </div>
</template>

<script>
import CodeManually from "./util/CodeManually.vue";
import CodeScanner from "./util/CodeScanner.vue";

export default {
  name: "RespondView",
  components: { CodeManually, CodeScanner },
  data() {
    return {
      showManually: false,
    };
  },
  created() {
    this.$store.commit("resetAnswers");
  },
  methods: {
    manually() {
      this.showManually = !this.showManually;
    },
  },
};
</script>

<style scoped>
.small-button {
  background: none;
  color: black;
  border: none;
  max-width: 250px;
  margin-left: auto;
  margin-right: auto;
}

.small-button:hover,
.small-button:active,
.small-button:focus {
  background: none;
  color: black;
  border: none;
  text-decoration: underline;
}

.container {
  max-width: 800px;
}
</style>
