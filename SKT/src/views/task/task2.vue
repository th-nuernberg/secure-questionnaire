<template>
  <body>
    <RecordAudio :taskNr="2"></RecordAudio>
    <SpeechRecognition v-if="!this.hide" ref="speechRecogn" :record="hide" @speeched="emitedWord"
      :words="selectedImages.map((x) => x['name'])" />

    <h3>Subtest II: Gegenstände unmittelbar reproduzieren</h3>
    <div>Aufgabe <strong>2</strong> von 8</div>

    <div v-if="!this.hide">      
      <TimeBar :duration="60" @timeout="this.finishedTask" ref="timeBar"/><br/>
      <h5>
        Sagen Sie bitte jetzt, welche Gegenstände Sie gerade gesehen haben. 
        An welche können Sie sich noch erinnern?</h5>
      <DisplayImages :listed_images="selectedImages" />

      <!--Entfernen (Nur für Testzwecke):-->
      <router-link class="btn-router" to="/lernphase" @click="finishedTask">Weiter</router-link><br><br>
    </div>

    <div class="popup" v-if="this.hide && !this.selectedImages.every((entry) => entry['recognized'])">
      <h4>Die Zeit ist um!<br />Jetzt werden Ihnen die Gegenstände noch einmal kurz gezeigt.</h4><br>
      <router-link class="btn-router" to="/lernphase">Los geht's</router-link>
    </div>

    <div class="popup" v-if="this.hide && this.selectedImages.every((entry) => entry['recognized'])">
      <h4>Sie haben alle Bilder vorgelesen!<br>Jetzt werden Ihnen die Gegenstände noch einmal kurz gezeigt.</h4><br>
      <router-link class="btn-router" to="/lernphase">Los geht's</router-link>
    </div>
    
  </body>
</template>

<script>
import images from "../../plugins/images.js";
import DisplayImages from "../../components/DisplayImages.vue";
import TimeBar from "../../components/TimeBar.vue";
import SpeechRecognition from "../../components/SpeechRecognition.vue";
import RecordAudio from "../../components/RecordAudio.vue";

export default {
  components: {
    DisplayImages,
    TimeBar,
    SpeechRecognition,
    RecordAudio,
  },
  data() {
    return {
      images,
      selectedImages: [],
      missingImages: [],
      hide: Boolean,
    };
  },
  methods: {
    getData() {
      return this.$store.getters.getData;
    },
    finishedTask() {
      this.hide = true;

      this.selectedImages.map((entry) => {
        if (entry["recognized"] == false) {
          this.missingImages.push(entry["name"]);
        }
      });

      this.$store.dispatch("addData", {
        task: 2,
        content: { 
          missing: this.missingImages, 
          time: this.$refs.timeBar.time },
      });
      
      this.$refs.speechRecogn.stop();
    },
    emitedWord(boolArray) {
      let test = boolArray
        .map((value, index) => {
          return {
            ...this.selectedImages[index],
            recognized: value || this.selectedImages[index]["recognized"],
          };
        })
        .sort((a, b) => {
          if (a["recognized"] == b["recognized"]) {
            return 0;
          }
          if (a["recognized"] && !b["recognized"]) {
            return -1;
          }
          return 1;
        });

      this.selectedImages = test;
      if (this.selectedImages.every((entry) => entry["recognized"])) {
        this.finishedTask();
      }
    },
  },
  created() {
    this.hide = false;
    this.selectedImages = this.getData()["1"]["images"];
    this.selectedImages = this.selectedImages.map((entry) => {
      return { ...entry, recognized: false, url: images["white"] };
    });
  },
  beforeUnmount() {
    if (!this.hide) {
      this.$refs.speechRecogn.stop();
    }
    this.hide = true;
  },
};
</script>
