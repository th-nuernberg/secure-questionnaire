<template>
    <body>

        <!-- <RecordAudio v-if="false" :taskNr="8"></RecordAudio> -->
        <!-- <GenericSpeechRecognition ref="speechRecogn" @speeched="emitedWord" /> -->
        <BNTDisplayImages :images="imageList"></BNTDisplayImages>
        <!-- <GenericSpeechRecognition v-if="!this.hide" ref="speechRecogn" :record="hide" @speeched="emitedWord" /> -->
        <!-- <div class="popup" v-if="this.done"> -->
            <!-- <h4>Die Zeit ist abgelaufen!<br>Sie haben {{ unique_animals.length }} Tiere genannt!</h4><br> -->
            <!-- <h4>Diese waren: {{ unique_animals.map((x) => x.toLocaleUpperCase()).join(" ") }}</h4><br> -->
            <!-- <router-link class="btn-router" to="/">Zurück zu den Tests</router-link> -->
        <!-- </div> -->

    </body>
</template>
<!-- this.localStorage-->

<script>
// import GenericSpeechRecognition from "../../components/GenericSpeechRecognition.vue";
// import RecordAudio from "../../components/RecordAudio.vue";
import BNTDisplayImages from "../../components/BNTDisplayImages.vue";
import bntimages from "../../plugins/bntimages";

export default {
    components: {
    // GenericSpeechRecognition,
    // RecordAudio,
    BNTDisplayImages
},
    data() {
        return {
            done: false,
            hide: Boolean,
            task_text: [],
            // imageList: bntimages
            imageList: [
                bntimages["baum"],
                bntimages["bett"],
               bntimages["pfeife"],
               bntimages["blume"],
               bntimages["haus"],
               bntimages["kanu"],
               bntimages["zahnbuerste"],
               bntimages["vulkan"],
               bntimages["maske"],
               bntimages["kamel"],
               bntimages["mundharmonika"],
               bntimages["eiszange"],
               bntimages["haengematte"],
               bntimages["trichter"],
               bntimages["dominosteine"],
            ],
        };
    },
    mounted() {
        console.log('mounted')
        console.log(bntimages['baum'])
        // this.$root.record();
        // console.log(BNTDisplayImages)
        // this.selectedImage = BNTDisplayImages['baum']
    },
    methods: {
        getresults(){
            console.log("getresults")
        }
//        emitedword(speechrec) {
//            console.log("vft record emit word");
//            console.log(speechrec);
//            this.words.push(speechrec);
//            // console.log(this.words.join(" "));
//            this.calculateresults();
//        // },
//        calculateResults() {
//            var tmp = this.words.join(" ").split(" ");
//            this.wordlist = [...new Set(tmp)];
//            this.unique_animals = this.getUniqueAnimals(this.wordlist, this.animals);
//            console.log(this.unique_animals);
//            console.log(this.unique_animals.length);
//        },
//        getUniqueAnimals(list1, list2) {
//            return list1.filter((item) => list2.includes(item));
//        }
//
    },

    created() {
        console.log("bnt perform test created");
        this.selectedImage = bntimages['baum'];
        console.log(this.selectedImage);
        // console.log(BNTDisplayImages);
        // this.hide = false;
        // this.$root.record();
    },
    // beforeUnmount() {
    // this.$refs.speechRecogn.stop();
    // },
};
</script>
