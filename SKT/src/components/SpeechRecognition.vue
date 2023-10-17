<template>
    <div class="voice"></div>
</template>

<script>
import checkSpeechforSim from "../plugins/levenshteindistance.js";

export default {
    name: "speech_to_text",
    props: {
        words: Array,
        record: Boolean,
        grammar: String,
    },
    data() {
        return {
            transcription_: [],
            lang_: "de-DE",
            checkSpeechforSim,
            recognObj: Object,
            stopIt: Boolean,
        };
    },
    emits: ["speeched"],
    methods: {
        stop() {
            this.stopIt = true;
        },

        emitText(text) {
            console.log(text);
            this.$emit("speeched", text);
        },
        startSpeechToTxt() {
            // initialisation of voicereco;

            window.SpeechRecognition =
                window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new window.SpeechRecognition();

            recognition.lang = this.lang_;
            recognition.interimResults = true;
            if (this.grammar && this.grammar != "") {
                console.log('--------------------------')
                console.log(this.grammar)
                // const grammar = new String("#JSGF V1.0; grammar animals; public <animal> = " + this.grammar + " ;"); // animal grammar is to large, supports only ~ 500 words, otherwise asr crashes w.o. error
                // const speechRecognitionList = new window.webkitSpeechGrammarList();
                // speechRecognitionList.addFromString(grammar, 1);
                // recognition.grammars = speechRecognitionList;
            }

            // event current voice reco word
            recognition.addEventListener("result", (event) => {
                var text = Array.from(event.results)
                    .map((result) => result[0])
                    .map((result) => result.transcript)
                    .join("");

                console.log(text);
                // console.log(this.checkSpeechforSim(text, this.words));

                this.emitText(this.checkSpeechforSim(text, this.words));
                if (this.stopIt) {
                    recognition.stop();
                }
                //this.emitText(text.toLocaleLowerCase());
            });
            // end of transcription
            recognition.addEventListener("end", () => {
                recognition.stop();
                if (!this.stopIt) {
                    recognition.start();
                }
            });
            recognition.start();
            this.recognObj = recognition;
        },
    },
    created() {
        this.startSpeechToTxt();
        this.stopIt = false;
        //console.log(this.words);
    },
    beforeUnmount() {
        this.stop();
    },
};
</script>
