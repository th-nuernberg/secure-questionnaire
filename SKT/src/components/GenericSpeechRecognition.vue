<template>
    <div class="voice"></div>
</template>

<script>

export default {
    name: "speech_to_text",
    props: {
        record: Boolean,
        asr: Object,
        grammar: String,
    },
    data() {
        return {
            transcription_: [],
            lang_: "de-DE",
            recognObj: Object,
        };
    },

    emits: ["speeched"],

    methods: {
        stop() {
            this.recognObj.stop();
        },
        emitText(text) {
            this.$emit("speeched", text);
        },
        setupSpeechToTxt() {
            // initialisation of speech recognition:

            window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new window.SpeechRecognition();

            recognition.lang = this.lang_;
            recognition.interimResults = true;
            console.log(this.grammar)
            if (this.grammar && this.grammar != "") {
                console.log('--------------------------')
                console.log(this.grammar)
                const grammar = new String("#JSGF V1.0; grammar animals; public <animal> = " + this.grammar + " ;"); // animal grammar is to large, supports only ~ 500 words, otherwise asr crashes w.o. error
                const speechRecognitionList = new window.webkitSpeechGrammarList();
                speechRecognitionList.addFromString(grammar, 1);
                recognition.grammars = speechRecognitionList;
            }
            // add event listener for result 
            recognition.addEventListener("result", (event) => {
                var text = Array.from(event.results)
                    .map((result) => result[0])
                    .map((result) => result.transcript)
                    .join("");
                // console.log(text);
                this.emitText(text.toLocaleLowerCase());
            });

            //   add event listener for end of transcription, restart if not stopped
            recognition.addEventListener("speechend", (event) => {
                console.log('speechend')
                console.log(event)
                // recognition.abort();
                setTimeout(function () { recognition.start(); }, 300);

            });

            // end of transcription
            recognition.start();
            this.recognObj = recognition;
        },
    },
    created() {
        // this.start()
        this.setupSpeechToTxt();
        console.log("generic asr created");
    },
    beforeUnmount() {
        this.recognObj.stop();
    },
};
</script>
