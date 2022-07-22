<template>
  <body class="body">
        
    <h3> VI: Symbole zählen</h3>
    <p style="float: left;">Aufgabe <strong>6</strong> von 9</p>
    <TimeBar :duration=6000 @timeout="this.timeOut" ref="timeBar" v-if="!this.hide"/><br>
  
    <div v-if="!this.hide">
    <h5>Sie sehen hier auf dieser Tafel verschiedene Symbole: Vierecke, Sterne und Blumen. 
      Wichtig sind nur die Vierecke
      Bitte zählen Sie sie so schnell sie können</h5><br>
     
     <BlankNumber :listed_numbers="selectedNumber"/><br> 

      <router-link class="btn-router" to="/task7" @click="timeOut">Weiter</router-link><br><br>
    </div>  

    <div class="popup" v-if="this.hide && !this.selectedNumber.every(entry => entry['recognized'])">
      <h4>Die Zeit ist um!<br>Hier geht es weiter zur nächsten Aufgabe</h4><br>
      <router-link class="btn-router" to="/task7">Weiter geht's</router-link>
    </div>

    <div class="popup" v-if="this.hide && this.selectedNumber.every(entry => entry['recognized'])">
      <h4>Sie haben alle Zahlen vorgelesen!<br>Hier geht es weiter zur nächsten Aufgabe</h4><br>
      <router-link class="btn-router" to="/task7">Weiter geht's</router-link>
    </div>
    
  </body>
</template>

<script>

import TimeBar from "../../components/TimeBar.vue";
import BlankNumber from "../../components/DisplayBlankNumber.vue";

export default {
  components:{
    TimeBar,
    BlankNumber,

  },
  data() {
    return{
      selectedNumber: [],
      hide: Boolean,     
    };
  },
  methods: {
    getData() {
      return this.$store.getters.getData;
    },
    shuffleArray(){
      let array = [...this.selectedNumber]
      console.log(array);
      let a,
      b, 
      temp;
      for (let i = 0; i < 10; i++){
        a = Math.floor(Math.random()*10)
        b = Math.floor(Math.random()*10);
        temp = array[a];
        array[a] = array[b];
        array[b] = temp;
        console.log(array[a]);
      }
      return array;

    },
    timeOut(){
      console.log('TimeOUT!!!!!!!')
      this.finishedTask()
    },
    finishedTask(){
      this.hide = true;
      this.$store.dispatch("addData", {'task':4, 'content':{'time':this.$refs.timeBar.time}})
    },
      },
  created() {
    this.hide = false;
    this.selectedNumber = this.getData()["3"]["numbers"];
    this.selectedNumber = this.shuffleArray(this.selectedNumber);
  },
}
</script>

