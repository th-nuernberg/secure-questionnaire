<template>
  <div>
    <button @click="recordAudio()">Rec</button>
    <button @click="stop()">Stop</button>
    <button @click="playAudio()">Play</button>
  </div>
</template>

<script>
export default {
  name: "RecAudio",
  props: {
    taskNr: Number,
  },
  data() {
    return {
      recorder: null,
      chunks: [],
      device: null,
      blobObj: null,
      audioUrl: null,
      audio: null,
    };
  },
  methods: {
    recordAudio() {
      this.device.then((stream) => {
        this.recorder = new MediaRecorder(stream);
        this.recorder.ondataavailable = (e) => {
          this.chunks.push(e.data);
          if (this.recorder.state === "inactive") {
            let blob = new Blob(this.chunks, { type: "audio/mp3" });
            //this.blobObj = blob;
            let vue = this;
            //this.chunks = [];
            var reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = function () {
              var base64String = reader.result;
              let data = { task: vue.taskNr, content: base64String };
              console.log(base64String);
              vue.$store.dispatch("addAudio", data);
            };
            //this.audioUrl = URL.createObjectURL(this.blobObj);
            //this.audio = new Audio(this.audioUrl);

            //this.$emit('recorded', this.audioUrl)
            //this.$store.dispatch("addData",data);
            //this.blobObj = null;
          }
        };
        // start
        this.recorder.start();
      });
    },
    stop() {
      this.recorder.stop();
    },
    record() {
      this.device = navigator.mediaDevices.getUserMedia({ audio: true });
      this.recordAudio();
    },

    playAudio() {
      this.audio.play();
    },
  },
  beforeUnmount() {
    //this.recorder.stop()
  },
  created() {
    //this.device = navigator.mediaDevices.getUserMedia({ audio: true });
    //this.recordAudio()
  },
};
</script>
