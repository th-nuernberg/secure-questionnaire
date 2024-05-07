<template>
    <body>
        <RecordAudio v-if="false" :taskNr="8"></RecordAudio>
        <!-- <GenericSpeechRecognition ref="speechRecogn" @speeched="emitedWord" :grammar="animals.sort().join(' | ')" /> -->
        <GenericSpeechRecognition ref="speechRecogn" @speeched="emitedWord" :grammar="''" /> 
        <div class="popup" v-if="this.done">
            <h4>Die Zeit ist abgelaufen!<br>Sie haben {{ unique_animals.length }} Tiere genannt!</h4><br>
            <h4>Diese waren: {{ unique_animals.map((x) => x.toLocaleUpperCase()).join(" ") }}</h4><br>
            <router-link class="btn-router" to="/">Zurück zu den Tests</router-link>
        </div>
        
        <div class="countdown" v-if="!this.done">
            <h1 v-if="countdown > 0">{{ countdown }}</h1>
            <h1 v-else-if="countdown <= 0 && !done">Testzeit abgelaufen, Auswertung läuft...</h1>

            <h1 v-if="countdown < 45 && countdown > 35"> Ihnen fallen sicher noch mehr Tiere ein! Machen Sie weiter so!</h1>
            <h1 v-else-if="countdown < 15 && countdown > 0">Endspurt, ein paar fallen Ihnen sicher noch ein!</h1>
            <h1 v-else-if="countdown > 0">Nennen Sie so viele Tiere wie Ihnen möglich!</h1>
            <h4 v-if="countdown > 0" >Erkannte Tiere: {{ unique_animals.join(" ") }}</h4>

        </div>

    </body>
</template>

<script>
import GenericSpeechRecognition from "../../components/GenericSpeechRecognition.vue";
import RecordAudio from "../../components/RecordAudio.vue";
import animals from "../../plugins/animals.js";

export default {
    components: {
        GenericSpeechRecognition,
        RecordAudio,
    },
    data() {
        return {
            animals,
            done: false,
            hide: Boolean,
            countdown: 60, // Set your desired countdown duration here
            words: [],
            wordlist: [],
            unique_animals: [],
        };
    },
    mounted() {
        this.startCountdown();
        this.$root.record();
    },
    methods: {
        startCountdown() {
            const interval = setInterval(() => {
                if (this.countdown > 0) {
                    this.countdown--;
                } else {
                    setTimeout(function () {
                        console.log('timeout')
                    }, 5000); //
                    clearInterval(interval);
                    this.done = true;
                    this.$refs.speechRecogn.stop();
                }
            }, 1000); // 1000ms = 1 second
        },


        emitedWord(speechrec) {
            console.log("vft record emit word");
            console.log(speechrec);
            this.words.push(speechrec);
            // console.log(this.words.join(" "));
            this.calculateResults();
        },
        calculateResults() {
            var tmp = this.words.join(" ").split(" ");
            this.wordlist = [...new Set(tmp)];
            this.unique_animals = this.getUniqueAnimals(this.wordlist, this.animals);
            console.log(this.unique_animals);
            console.log(this.unique_animals.length);
        },
        getUniqueAnimals(list1, list2) {
            return list1.filter((item) => list2.includes(item));
        }

    },

    created() {
        this.animals = this.animals.map((x) => x.toLocaleLowerCase());
    },
    beforeUnmount() {
        this.$refs.speechRecogn.stop();
        this.$root.stop();
    },
};
</script>

<style>
.countdown {
    text-align: center;
    font-size: 5rem;
    margin-top: 25vh;
}
</style>