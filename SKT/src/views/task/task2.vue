<template>
  <body class="body">

    <h3>Subtest II: Gegenstände unmittelbar reproduzieren</h3>
    <p style="float: left;">Aufgabe <strong>2</strong> von 10</p>

    <SpeechRecognition v-if="!this.hide"  ref="speechRecogn" :record="hide" @speeched="emitedWord" :words="selectedImage.map(x => x['name'])" />
    
    <div v-if="!this.hide">
    <TimeBar :duration=60 @timeout="this.timeOut" ref="timeBar"/>
    <h5>Sagen Sie bitte jetzt, welche Gegenstände Sie gerade gesehen haben.
      An welche können Sie sich noch erinnern?</h5>
    <DisplayImages :listed_images="selectedImage" />
    <router-link class="btn-router" to="/lernphase" @click="timeOut">Weiter</router-link>
    </div>

    <div class="popup" v-if="this.hide && !this.selectedImage.every(entry => entry['recognized'])">
      <h4>Die Zeit ist um!<br>Jetzt werden Ihnen die Gegenstände noch einmal kurz gezeigt.</h4><br>
      <router-link class="btn-router" to="/lernphase">Los geht's</router-link>
    </div>

    <div class="popup" v-if="this.hide && this.selectedImage.every(entry => entry['recognized'])">
      <h4>Sie haben alle Bilder vorgelesen!<br>Jetzt werden Ihnen die Gegenstände noch einmal kurz gezeigt.</h4><br>
      <router-link class="btn-router" to="/lernphase">Los geht's</router-link>
    </div>

  </body>
</template>

<script>

import images from "../../assets/images/images.js";
import DisplayImages from "../../components/DisplayImages.vue";
import TimeBar from "../../components/TimeBar.vue";
import SpeechRecognition from "../../components/SpeechRecognition.vue";

export default {
  components:{
    DisplayImages,
    TimeBar,
    SpeechRecognition
  },
  data() {
    return{
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
    timeOut(){
      console.log('TimeOUT!!!!!!!')
      this.finishedTask()
    },
    finishedTask(){
      this.hide = true;
  
      this.selectedImage.map(entry => {
        if(entry['recognized']==false){
           this.missingImages.push(entry['name'])
        }
      })

      this.$store.dispatch("addData", {'task':2, 'content':{'missing': this.missingImages ,'time':this.$refs.timeBar.time}})
      this.$refs.speechRecogn.stop()
    },
    emitedWord(boolArray) {
      let test = boolArray.map( (value, index) => {
        return {...this.selectedImage[index], 'recognized': value || this.selectedImage[index]['recognized']}
      })

      this.selectedImage = test;      
      if(this.selectedImage.every(entry => entry['recognized'])){
       this.finishedTask()
      }
    }
  },
  created() {
    this.hide = false;
    this.selectedImage = this.getData()["1"]["images"];
    this.selectedImage = this.selectedImage.map(entry => { return {...entry, 'recognized':false, 'url':images['white'] }})
  },
<<<<<<< HEAD
   beforeUnmount() {
    if(!this.hide){    
      this.$refs.speechRecogn.stop()
    }
    this.hide = true;
  } 
=======
      beforeUnmount() {
      if(!this.hide){    
      this.$refs.speechRecogn.stop()
      }
      this.hide = true;
  }
  
>>>>>>> 178eb92dff7d05c5e8a057d4af6b2c1e5ded1e34
}

</script>

