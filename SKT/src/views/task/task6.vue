<template>

  <body>

    <h3>Subtest VI: Gegenstände nach Ablenkung reproduzieren</h3>
    <div>Aufgabe <strong>6</strong> von 7</div>

    <SpeechRecognition v-if="!this.hide" ref="speechRecogn" :record="hide" @speeched="emitedWord"
      :words="selectedImages.map(x => x['name'])" />

    <div v-if="!this.hide">
      <TimeBar :duration=60 @timeout="this.finishedTask" ref="timeBar"/><br />
      <h5>
        Jetzt kommen wir noch einmal zu den Gegenständen, die Sie am Anfang gesehen haben.<br>
        An welche können Sie sich noch erinnern?
      </h5>
      <DisplayImages :listed_images="selectedImages" />

      <!--Nur für Testzwecke:
      <router-link class="btn-router" to="/task8" @click="finishedTask">Weiter</router-link><br><br>-->

    </div>

    <div class="popup" v-if="this.hide && !this.selectedImages.every(entry => entry['recognized'])">
      <h4>Die Zeit ist um!<br>Hier geht es weiter zur nächsten Aufgabe</h4><br>
      <router-link class="btn-router" to="/task7">Weiter geht's</router-link>
    </div>

    <div class="popup" v-if="this.hide && this.selectedImages.every(entry => entry['recognized'])">
      <h4>Sie haben alle Gegenstände vorgelesen!<br>Hier geht es weiter zur nächsten Aufgabe</h4><br>
      <router-link class="btn-router" to="/task7">Weiter geht's</router-link>
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
    SpeechRecognition
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

      this.selectedImages.map(entry => {
        if (entry['recognized'] == false) {
          this.missingImages.push(entry['name'])
        }
      })

      this.$store.dispatch("addData", { 
        task: 6, 
        content: { 
          missing: this.missingImages, 
          time: this.$refs.timeBar.time } })
      this.$refs.speechRecogn.stop()
    },
    emitedWord(boolArray) {
      let test = boolArray.map((value, index) => {
        return { ...this.selectedImages[index], 'recognized': value || this.selectedImages[index]['recognized'] }
      }).sort((a, b) => {
        if (a['recognized'] == b['recognized']) {
          return 0;
        }
        if (a['recognized'] && !b['recognized']) {
          return -1;
        }
        return 1;
      }
      )

      this.selectedImages = test;
      if (this.selectedImages.every(entry => entry['recognized'])) {
        this.finishedTask()
      }
    }
  },
  created() {
    this.hide = false;
    this.selectedImages = this.getData()["1"]["images"];
    this.selectedImages = this.selectedImages.map(entry => { return { ...entry, 'recognized': false, 'url': images['white'] } })
  },
  beforeUnmount() {
    if (!this.hide) {
      this.$refs.speechRecogn.stop()
    }
    this.hide = true;
  }
}

</script>

