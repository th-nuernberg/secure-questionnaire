<template>
  <body>

    <RecordAudio v-if="false" :taskNr="1"></RecordAudio>
    <SpeechRecognition v-if="!this.hide" ref="speechRecogn" :record="hide" @speeched="emitedWord"
      :words="selectedImage.map(x => x['name'])" />

    <h3>Subtest I: Gegenstände benennen und einprägen</h3>
    <div>Aufgabe <strong>1</strong> von 7</div>

    <div v-if="!this.hide">
      <TimeBar :duration="60" @timeout="this.finishedTask" ref="timeBar"/><br/>
      <h5>Sagen Sie jetzt bitte ganz schnell, wie die Gegenstände heißen und merken Sie sie sich.</h5>
      <DisplayImages :listed_images="selectedImage" />

      <!--Nur für Testzwecke:
      <router-link class="btn-router" to="/task2" @click="finishedTask">Weiter</router-link><br><br>-->
      
    </div>

    <div class="popup" v-if="this.hide && !this.selectedImage.every(entry => entry['recognized'])">
      <h4>Die Zeit ist um!<br>Hier geht es weiter zur nächsten Aufgabe</h4><br>
      <router-link class="btn-router" to="/task2">Weiter geht's</router-link>
    </div>

    <div class="popup" v-if="this.hide && this.selectedImage.every(entry => entry['recognized'])">
      <h4>Sie haben alle Bilder vorgelesen!<br>Hier geht es weiter zur nächsten Aufgabe</h4><br>
      <router-link class="btn-router" to="/task2">Weiter geht's</router-link>
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
      selectedImage: [],
      hide: Boolean,
      Audio: null,
    };
  },
  methods: {
    randomItem(items) {
      return items[Math.floor(Math.random() * items.length)];
    },
    addData(data) {
      this.$store.dispatch("addData", data);
    },
    finishedTask() {
      this.hide = true;

      this.$store.dispatch("addData", {
        task: 1,
        content: { 
          images: this.selectedImage, 
          time: this.$refs.timeBar.time },
      });

      this.$refs.speechRecogn.stop();
    },
    emitedWord(boolArray) {
      let test = boolArray.map((value, index) => {
        return {
          ...this.selectedImage[index],
          recognized: value || this.selectedImage[index]["recognized"],
        };
      });

      this.selectedImage = test;

      if (this.selectedImage.every((entry) => entry["recognized"])) {
        this.finishedTask();
      }
    },
  },
  created() {
    while (this.selectedImage.length < 12) {
      var img = this.randomItem(Object.entries(this.images["imgs"]));
      if (!this.selectedImage.map((x) => x["name"]).includes(img[0])) {
        this.selectedImage.push({
          url: img[1],
          name: img[0],
          recognized: false,
        });
      }
    }
    this.hide = false;
    this.$root.record();
  },
  beforeUnmount() {
    if (!this.hide) {
      this.$refs.speechRecogn.stop();
    }
    this.hide = true;
  },
};
</script>
