<template>
  <body>
    <SpeechRecognition v-if="!this.hide" ref="speechRecogn" :record="hide" @speeched="emitedWord"
      :words="selectedImage.map((x) => x['name'])" />

    <h3>Subtest VIII: Gegenstände wiedererkennen</h3>
    <div>Aufgabe <strong>8</strong> von 8</div>
    
    <div v-if="!this.hide">      
      <TimeBar :duration="60" @timeout="this.finishedTask" ref="timeBar" /><br />
      <h5>
        Ihnen wird nun eine Tafel mit vielen Gegenständen gezeigt. 
        Unter diesen befinden sich auch diejenigen, die Sie vorhin gesehen haben. 
        Suchen Sie diese bitte heraus.
      </h5>
      <DisplayImages :listed_images="selectedImage" />

      <!--Entfernen (Nur für Testzwecke):-->
      <router-link class="btn-router" to="/auswertung" @click="finishedTask">Weiter</router-link><br /><br />
    </div>

    <div class="popup" v-if="this.hide && !this.selectedImage.every((entry) => entry['recognized'])">
      <h4>Die Zeit ist um!<br /></h4><br />
      <router-link class="btn-router" to="/auswertung">Beenden</router-link>
    </div>

    <div class="popup" v-if="this.hide && this.selectedImage.every((entry) => entry['recognized'])">
      <h4>Sie haben alle Bilder vorgelesen!<br /></h4><br />
      <router-link class="btn-router" to="/auswertung">Beenden</router-link>
    </div>

  </body>
</template>

<script>
import images from "../../plugins/images.js";
import DisplayImages from "../../components/DisplayImages.vue";
import TimeBar from "../../components/TimeBar.vue";
import SpeechRecognition from "../../components/SpeechRecognition.vue";

export default {
  components: {
    DisplayImages,
    TimeBar,
    SpeechRecognition,
  },
  data() {
    return {
      images,
      selectedImage: [],
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

      this.selectedImage.map((entry) => {
        if (entry["recognized"] == false) {
          this.missingImages.push(entry["name"]);
        }
      });

      this.$store.dispatch("addData", {
        task: 8,
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
            ...this.selectedImage[index],
            recognized: value || this.selectedImage[index]["recognized"],
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

      this.selectedImage = test;
      if (this.selectedImage.every((entry) => entry["recognized"])) {
        this.finishedTask();
      }
    },
  },
  created() {
    this.hide = false;
    this.selectedImage = this.getData()["1"]["images"];
    this.selectedImage = this.selectedImage.map((entry) => {
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
