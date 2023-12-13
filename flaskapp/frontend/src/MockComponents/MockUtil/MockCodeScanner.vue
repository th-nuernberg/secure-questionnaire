<template>
  <div class="col">
    <div class="scanner">
      <qrcode-stream @init="onInit" class="camera" />
      <div class="statusMsg" :class="alert" role="alert">
        {{ status }}
      </div>
    </div>
  </div>
</template>

<script>
import { QrcodeStream } from "vue3-qrcode-reader";

export default {
  components: { QrcodeStream },
  data() {
    return {
      status: "Kamera bereit!",
      alert: "alert-warning",
    };
  },
  methods: {
    async onInit(promise) {
      try {
        await promise;
      } catch (error) {
        if (error.name === "NotAllowedError") {
          this.alert = "alert-danger";
          this.status = "ERROR: Kamerazugriff notwendig!";
        } else if (error.name === "NotFoundError") {
          this.alert = "alert-danger";
          this.status = "ERROR: Kamera notwendig!";
        } else if (error.name === "NotSupportedError") {
          this.alert = "alert-danger";
          this.status = "ERROR: secure context required (HTTPS, localhost)";
        } else if (error.name === "NotReadableError") {
          this.alert = "alert-danger";
          this.status = "ERROR: Kamera kann nicht doppelt verwendet werden!";
        } else if (error.name === "OverconstrainedError") {
          this.alert = "alert-danger";
          this.status = "ERROR: Kamera ungeeignet.";
        } else if (error.name === "StreamApiNotSupportedError") {
          this.alert = "alert-danger";
          this.status = "ERROR: Stream API is not supported in this browser";
        }
      }
    },
  },
};
</script>

<style scoped>
.statusMsg {
  position: absolute;
  bottom: 5px;
  margin-left: auto;
  margin-right: auto;
  max-width: 150px;
  left: 0;
  right: 0;
  text-align: center;
  padding: 10px;
  border-radius: 20px;
}

.scanner {
  position: relative;
  width: 300px;
}
</style>
