<template>
  <div class="voice">
</div>
</template>



 <script>

  export default {
   name: 'speech_to_text',
    props: {
            words: Array,
            record: Boolean,
        },
   data() {
     return {
       transcription_: [],
       lang_: "de-DE"
     };
   },
   emits: ['speeched'],
   methods: {
    emitText(text){

        this.$emit('speeched', text);
    },
    startSpeechToTxt() {
    // initialisation of voicereco;
    

    window.SpeechRecognition =
    window.SpeechRecognition || 
    window.webkitSpeechRecognition;
    const recognition = new window.SpeechRecognition();


    recognition.lang = this.lang_;
    recognition.interimResults = true;

    // event current voice reco word
    recognition.addEventListener("result", event => {      
      var text = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join("");


      
    let filtered = this.words.filter(word => text.toLowerCase().includes(word));
    if(filtered.length != 0){
        
        this.emitText(filtered[0])
    }
           if(this.record){
      recognition.stop();
}
    //this.emitText(text.toLocaleLowerCase());
      
    });
    // end of transcription
    recognition.addEventListener("end", () => {


      recognition.stop();
       if(!this.record){
      recognition.start();
}

    });
     recognition.start();
   },

   },
   created() {
       this.startSpeechToTxt();

   }
  }
  </script>