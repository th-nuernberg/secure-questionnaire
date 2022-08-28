<template>
<div></div>
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
      //blobObj: null,
      //audioUrl: null,
      //audio: null,
      recording: false,
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
            let vue = this;
            var reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = function () {
              var base64String = reader.result;
              let data = { task: vue.taskNr, content: base64String };
              vue.$store.dispatch("addAudio", data);
            };
     
          }
        };
        this.recorder.start();
      });
    },
    stop() {
      if(this.recording){
      this.recorder.stop();
      this.recording = false;
      }
    },
    record() {
      this.device = navigator.mediaDevices.getUserMedia({ audio: true });
      this.recordAudio();
      this.recording = true;
    },

    playAudio() {
      this.audio.play();
    },
  }
};
</script>
