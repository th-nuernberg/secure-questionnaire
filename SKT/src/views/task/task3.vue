<template>
  <body>
        
    <RecordAudio :taskNr="3"></RecordAudio>
    <SpeechRecognition v-if="!this.hide"  ref="speechRecogn" :record="hide" @speeched="emitedWord" :words="selectedNumber.map(x => x['num'])" />

    <h3>Subtest III: Zahlen lesen</h3>
    <div>Aufgabe <strong>3</strong> von 8</div>

    <TimeBar :duration=600 @timeout="this.timeOut" ref="timeBar" v-if="!this.hide"/><br>    
    <div v-if="!this.hide">
    <h5> Sie sehen hier ein Spielbrett mit bunten Spielsteinen, auf denen Zahlen stehen.<br>
      Als erstes lesen Sie bitte die Zahlen laut vor, so schnell Sie können. Sie brauchen sich die Zahlen nicht zu merken.</h5>
    <DisplayNumber :listed_numbers="selectedNumber"/><br>
    <router-link class="btn-router" to="/task4" @click="timeOut">Weiter</router-link><br><br>
    </div>  

    <div class="popup" v-if="this.hide && !this.selectedNumber.every(entry => entry['recognized'])">
      <h4>Die Zeit ist um!<br>Hier geht es weiter zur nächsten Aufgabe</h4><br>
      <router-link class="btn-router" to="/task4">Weiter geht's</router-link>
    </div>
 
    <div class="popup" v-if="this.hide && this.selectedNumber.every(entry => entry['recognized'])">
      <h4>Sie haben alle Zahlen vorgelesen!<br>Hier geht es weiter zur nächsten Aufgabe</h4><br>
      <router-link class="btn-router" to="/task4">Weiter geht's</router-link>
    </div>
    
  </body>
</template>

<script>

import colors from "../../plugins/colors.js"
import TimeBar from "../../components/TimeBar.vue";
import DisplayNumber from "../../components/DisplayNumber.vue";
import SpeechRecognition from "../../components/SpeechRecognition.vue";
import RecordAudio from "../../components/RecordAudio.vue";

export default {
  components:{
    TimeBar,
    DisplayNumber,
    SpeechRecognition,
    RecordAudio
  },
  data() {
    return{
      selectedNumber: [],
      hide: Boolean,
      colors,
    };
  },
  methods: {
    emitedWord(boolArray) {
      let test = boolArray.map( (value, index) => {
        return {...this.selectedNumber[index], 'recognized': value || this.selectedNumber[index]['recognized']}
      })

      this.selectedNumber = test;
      
      if(this.selectedNumber.every(entry => entry['recognized'])){
       this.finishedTask()
      }
    },
    addData(data) {
      this.$store.dispatch("addData", data);
    },
    timeOut(){
      console.log('TimeOUT!!!!!!!')
      this.finishedTask()
    },
    finishedTask(){
      this.hide = true;
      this.$store.dispatch("addData", {'task':3, 'content':{'numbers':this.selectedNumber ,'time':this.$refs.timeBar.time}})
    },
  },
  created() {
    this.hide = false;
    let i = 0; 
    while(this.selectedNumber.length<10){
      var num = Math.floor(Math.random()*100)
      if(!this.selectedNumber.map(x => x['num'] ).includes(num) && num>9){
        this.selectedNumber.push({'num':num, 'color': this.colors[i],'recognized':false}); 
        i++;   
      } 
    }
  },
}

</script>

