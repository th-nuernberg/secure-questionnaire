<template>
  <div class="voice">
    <div v-if=false class="speech-to-txt" @click="startSpeechToTxt">Speech to txt</div>        
    <p v-if=false >{{transcription_}}</p>
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
       runtimeTranscription_: "",
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
    
    var grammar = "Pferd | Stand"
    console.log(grammar);
    window.SpeechRecognition =
    window.SpeechRecognition || 
    window.webkitSpeechRecognition;
    const recognition = new window.SpeechRecognition();

    var speechRecognitionList = new window.webkitSpeechGrammarList();
    speechRecognitionList.addFromString(grammar, 1);
    recognition.grammars = speechRecognitionList;

    recognition.lang = this.lang_;
    recognition.interimResults = true;

    // event current voice reco word
    recognition.addEventListener("result", event => {      
      var text = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join("");
      //this.runtimeTranscription_ = text;

      
    let filtered = this.words.filter(word => text.toLowerCase().includes(word));
    if(filtered.length != 0){
        
        this.emitText(filtered[0])
    }
    //this.emitText(text.toLocaleLowerCase());
      
    });
    // end of transcription
    recognition.addEventListener("end", () => {
      this.transcription_.push(this.runtimeTranscription_);
      
      this.runtimeTranscription_ = "";
      recognition.stop();
      console.log(this.record)
       if(!this.record){
      recognition.start();
}

    });
     recognition.start();
   },

   },
   created() {
       this.startSpeechToTxt();
       console.log(this.words)
   }
  }
  </script>