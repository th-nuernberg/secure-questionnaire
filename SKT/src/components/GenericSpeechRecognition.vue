<template>
    <div class="voice"></div>
</template>

<script>

export default {
    name: "speech_to_text",
    props: {
        record: Boolean,
        asr: Object,
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
            //   console.log(text);
            this.$emit("speeched", text);
            //   this.startSpeechToTxt();
        },
        setupSpeechToTxt() {
            // initialisation of speech recognition:

            window.SpeechRecognition =
                window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new window.SpeechRecognition();

            recognition.lang = this.lang_;
            recognition.interimResults = true;

            // add event listener for result 
            recognition.addEventListener("result", (event) => {
                var text = Array.from(event.results)
                    .map((result) => result[0])
                    .map((result) => result.transcript)
                    .join("");
                console.log(text);
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
            //   this.asr = this.recognObj;
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
