<template>
  <section class="user-details p-5">
    <div class="text-center">
      <h1>Ihr ausgefüllter Fragebogen</h1>
      <qr-code class="qr" :content="content"></qr-code>
    </div>
    <h4>1. Fragebogen öffnen</h4>
    <p>
      Um den Fragebogen zu bearbeiten, scannen Sie den QR-Code auf
      <a href="https://kiz1.in.ohmportal.de">kiz1.in.ohmportal.de</a> ein.
      <br />Sie werden automatisch zu Ihrem ausgefüllten Fragebogen
      weitergeleitet.
    </p>
    <h4>2. Fragebogen auswerten</h4>
    <p>
      Bringen Sie diesen QR-Code beim nächsten Termin mit, damit der Arzt Ihre
      Antworten auswerten kann.
    </p>
    <p>
      Beachten Sie, dass dieser QR-Code nur solange gültig ist, bis Sie die
      Antworten bearbeiten oder ergänzen und einen neuen Code bekommen.
    </p>
    <h4>Wichtiger Hinweis:</h4>
    <p>
      Mit diesem QR-Code kann Ihr ausgefüllter Fragebogen entschlüsselt werden
      und somit sensible Daten eingesehen werden.<br />Geben Sie Ihn nicht an
      Dritte weiter.
    </p>
  </section>
</template>

<script>
import QrCode from "../QrCode.vue";

export default {
  props: {
    answersID: String,
    AESkey: Uint8Array,
    repeating: Boolean,
  },
  components: {
    QrCode,
  },
  data() {
    return {
      qrcontent: {
        ID: this.answersID,
        key: this.decodedKey(),
      },
    };
  },
  computed: {
    content() {
      return JSON.stringify(this.qrcontent);
    },
  },
  methods: {
    decodedKey() {
      return Buffer.from(this.AESkey).toString("base64");
    },
  },
};
</script>

<style lang="scss" scoped>
.qr {
  width: 300px;
  height: 300px;
  margin-right: auto;
  margin-left: auto;
  margin-top: 50px;
  margin-bottom: 50px;
}

.code {
  border-radius: 10px;
  border: 2px solid black;
}

h4 {
  margin-top: 20px;
}
</style>
