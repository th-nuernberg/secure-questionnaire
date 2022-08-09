<template>
  <body>

    <h3>Subtest VIII: Gegenstände reproduzieren</h3>
    <div>Aufgabe <strong>8</strong> von 8</div>

    <SpeechRecognition v-if="!this.hide"  ref="speechRecogn" :record="hide" @speeched="emitedWord" :words="selectedImage.map(x => x['name'])" />
    
    <TimeBar :duration=60 @timeout="this.timeOut" ref="timeBar" v-if="!this.hide"/>
    <div v-if="!this.hide">
    <h5>Jetzt kommen wir noch einmal zu den Gegenständen, die Sie am Anfang gesehen haben.<br>
      An welche können Sie sich noch erinnern?</h5>
    <DisplayImages :listed_images="selectedImage" />
    <router-link class="btn-router" to="/auswertung" @click="timeOut">Weiter</router-link><br><br>
    </div>  

    <div class="popup" v-if="this.hide && !this.selectedNumber.every(entry => entry['recognized'])">
      <h4>Die Zeit ist um!<br>Hier geht es weiter zur nächsten Aufgabe</h4><br>
      <router-link class="btn-router" to="/auswertung">Weiter geht's</router-link>
    </div>

    <div class="popup" v-if="this.hide && this.selectedNumber.every(entry => entry['recognized'])">
      <h4>Sie haben alle Zahlen vorgelesen!<br>Hier geht es weiter zur nächsten Aufgabe</h4><br>
      <router-link class="btn-router" to="/auswertung">Weiter geht's</router-link>
    </div>

  </body>
</template>

<script>

import images from "../../plugins/images.js";
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

      this.$store.dispatch("addData", {'task':8, 'content':{'missing': this.missingImages ,'time':this.$refs.timeBar.time}})
      this.$refs.speechRecogn.stop()
    },
    emitedWord(boolArray) {
      let test = boolArray.map( (value, index) => {
        return {...this.selectedImage[index], 'recognized': value || this.selectedImage[index]['recognized']}
      }).sort((a,b)=> {
        if(a['recognized'] == b['recognized']){
          return 0;
        }
        if (a['recognized'] && !b['recognized']){
          return -1;
          }
          return 1;
        }
      )

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
   beforeUnmount() {
    if(!this.hide){    
      this.$refs.speechRecogn.stop()
    }
    this.hide = true;
  this.$root.stop()
  } 
}

</script>

