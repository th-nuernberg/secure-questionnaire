<template>
    <body>

        <!-- <RecordAudio v-if="false" :taskNr="8"></RecordAudio> -->
        <GenericSpeechRecognition ref="speechRecogn" @speeched="emitedWord" />
        <BNTDisplayImages v-if="!this.done" ref="displayImg" :images="imageList" @nextimage="nextimage" @testfinished="testfinished" :recognized="recognized" ></BNTDisplayImages>
        <div class="popup" v-if="this.done">
            <h4>Das war das letzte Bild. Der Test ist nun beendet. <br>Sie haben {{ numCorrect }} von {{ imageList.length }} Bildern korrekt genannt!</h4><br>
            <router-link class="btn-router" to="/">Zurück zur Testübersicht</router-link>
        </div>


    </body>
</template>
<!-- this.localStorage-->

<script>
// import GenericSpeechRecognition from "../../components/GenericSpeechRecognition.vue";
// import RecordAudio from "../../components/RecordAudio.vue";
import BNTDisplayImages from "../../components/BNTDisplayImages.vue";
import imgs from "../../plugins/bntimages";
import GenericSpeechRecognition from "../../components/GenericSpeechRecognition.vue";

export default {
    components: {
        GenericSpeechRecognition,
        // RecordAudio,
        BNTDisplayImages
    },
    data() {
        return {
            done: false,
            hide: Boolean,
            numCorrect: 0,
            task_text: [],
            imagedict: imgs['bntimages'],
            alternatives: imgs['alternatives'],
            imageList: [],
            imageNames: [],
            word_to_recogniton: {},
            recognized: false,
        };
    },
    // mounted() {
        // console.log('mounted')
        // console.log(this.alternatives)
        // this.$root.record();
        // console.log(BNTDisplayImages)
        // this.selectedImage = BNTDisplayImages['baum']
    // },
    methods: {
        nextimage() {
            this.$refs.speechRecogn.stop();
            this.$refs.speechRecogn.setupSpeechToTxt();
            this.recognized = false;
            // console.log(this.$refs.displayImg.currentIndex);
            // console.log(this.imageNames[this.$refs.displayImg.currentIndex]);
            // this.$root.record();
        },
        testfinished() {
            console.log("testfinished");
            // console.log(this.word_to_recogniton);
            this.$refs.speechRecogn.stop();
            this.done = true;
            console.log(this.word_to_recogniton);
            this.scoreList();

        },
        scoreList() {
            Object.entries(this.word_to_recogniton).forEach(entry => {
                const [key, value] = entry;
                console.log(key, value);
                let score = this.checkResult(key, value);
                console.log(score.length);
                score > 0 ? this.numCorrect++ : this.numCorrect;
            });
 
        }, 
        checkResult(target, recognition) {
                var test = recognition.join(" ").split(" ");
                var words = [...new Set(test)];
                var score = words.filter((item) => this.alternatives[target].includes(item));
                return score.length
        },

        emitedWord(speechrec) {
            console.log(speechrec);
            this.word_to_recogniton[this.imageNames[this.$refs.displayImg.currentIndex]].push(speechrec);
            console.log(this.word_to_recogniton[this.imageNames[this.$refs.displayImg.currentIndex]]);
            let score = this.checkResult(this.imageNames[this.$refs.displayImg.currentIndex], this.word_to_recogniton[this.imageNames[this.$refs.displayImg.currentIndex]])
            console.log(score);
            this.recognized = score > 0;
            console.log(this.recognized);
        },
    },

    created() {
        console.log("bnt perform test created");
        // this.selectedImage = bntimages['baum'];
        // console.log(this.selectedImage);
        Object.keys(this.imagedict).forEach((key) => {
            this.imageList.push(this.imagedict[key]);
            this.imageNames.push(key);
            this.word_to_recogniton[key] = [];
        });
        console.log(this.imageList);
        console.log(this.imageNames);
        console.log(this.word_to_recogniton);
    },
    // beforeUnmount() {
    // this.$refs.speechRecogn.stop();
    // },
};
</script>
