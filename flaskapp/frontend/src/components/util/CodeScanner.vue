<template>
  <div class="col">
    <div class="scanner">
      <qrcode-stream @decode="onDecode" @init="onInit" :camera="selectedCamera" class="camera" />
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
    async onDecode(result) {
      if (result.includes("patient/questionnaire")) {
        //QR-Code vom Arzt mit kompletter URL
        this.alert = "alert-success";
        let path = result.split("/");
        let queID = path.pop();
        this.$router.push({
          name: "PatientQuestionnaire",
          params: { id: queID },
        });
      } else {
        let obj = JSON.parse(result);
        if (
          this.$route.path.includes("patient") &&
          obj.ID !== undefined &&
          obj.key !== undefined
        ) {
          //QR-Code zum Bearbeiten der Antworten
          this.alert = "alert-success";
          this.$store
            .dispatch("getAnswers", { id: obj.ID, key: obj.key })
            .then((answers) => {
              this.$router.push({
                name: "PatientQuestionnaire",
                params: { id: answers.queID },
              });
            })
            .catch(() => {
              this.alert = "alert-warning";
            });
        }
        if (
          this.$route.path.includes("doctor") &&
          obj.ID !== undefined &&
          obj.key !== undefined
        ) {
          //QR-Code zum Auslesen durch Arzt
          this.$emit("addAnalyseID", {
            id: obj.ID,
            key: obj.key,
          });
        }
      }
    },
    async onInit(promise) {
      try {
        await promise
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
    
    async getDevices () {
      // get the list of devices
      const devices = await navigator.mediaDevices.enumerateDevices()
      // filter only the video devices
      const cameras = devices.filter(device => device.kind === 'videoinput')
      // store the cameras in your data or state
      this.cameras = cameras
    },

    async getStream () {
      // get the selected camera id from your data or state
      const cameraId = this.selectedCamera
      // request the stream from the camera
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: myPreferredCameraDeviceId//this.cameras[0] ?
        }
      })
      // store the stream in your data or state
      this.stream = stream
    },

    mounted () {
      // get the video or qrcode element from refs
      const video = this.$refs.video || this.$refs.qrcode.$el
      // set the srcObject to the stream
      video.srcObject = this.stream
}


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
