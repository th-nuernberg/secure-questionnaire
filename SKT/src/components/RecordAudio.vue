<template>
  
  <div>
    <button @click="recordAudio()">Rec</button>

    <button @click="stop()">Stop</button>
<button @click="playAudio()">Play</button>
  </div>
</template>



 <script>



  export default {
   name: 'RecAudio',
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
   emits: ['recorded'],
   methods: {
  recordAudio() {
      this.device.then((stream) => {
        this.recorder = new MediaRecorder(stream);
        this.recorder.ondataavailable = (e) => {
          this.chunks.push(e.data);
          if (this.recorder.state === "inactive") {
            let blob = new Blob(this.chunks, { type: "audio/mp3" });
            this.blobObj = blob;
            console.log(blob)
            console.log(this.chunks)
            this.chunks = [];

            this.audioUrl = URL.createObjectURL(this.blobObj);
            this.audio = new Audio(this.audioUrl);
            //let data =  {'task':'audio','content':this.blobObj}
            this.$emit('recorded', this.audioUrl)
            //this.$store.dispatch("addData",data);
            //this.blobObj = null;
          }
        };
        // start
        this.recorder.start();
      });
    },
    stop() {
 

    this.recorder.stop()
    
    
    

    },

    playAudio(){
 
         this.audio.play()

    }

   },
   created(){
    this.device = navigator.mediaDevices.getUserMedia({ audio: true });
    this.recordAudio()
   }
  }
  </script>